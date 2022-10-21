import { PostLike, SavedPost, Follow, Post } from "../models/index.js";
import { redisPosts, redisTrending } from "../configs/redis.js";
import schedule from 'node-schedule';
import fastJson from 'fast-json-stringify';
import { addCommentsStatistics, getCommentsUderPost } from "./commentServices.js";
const stringifyPostInfo = fastJson(
    {
        type:'object',
        properties: {
            _id: { type: 'string' }
            , title: { type: 'string' }
            , description: { type: 'string' }
            , publishDate: { type: 'string' }
            , updateDate: { type: 'string' }
            , tags: { type: 'array' }
            , author: {
                type: 'object', properties: {
                    _id: { type: 'string' }
                    , avatar: { type: 'string' }
                    , username: { type: 'string' }
                }
            }
            , __v: { type: 'integer' }
        }
    }
);

//get the post info related to the loggined user
async function getOnePostInfo(postId) {
    try {
        let [postInfo, commentUnderPost] = await Promise.all([
            Post.findById(postId, { put: 0, edited: 0, likes: 0 })
                .lean()
                .populate('author', {
                    _id: 1, avatar: 1, username: 1
                }, { lean: true }),
            getCommentsUderPost(postId)
        ])

        return { postInfo, commentUnderPost };
    } catch (error) {
        console.log('getOnePostInfoFailed --Pservices 35');
    }
}

async function incPostStatistics(postId, field, incNum) {
    try {
        const key = JSON.stringify(postId) + ' Statiscs';
        const result = await redisPosts.hincrby(key, field, incNum);
        if (result < 0) {
            await redisPosts.hset(key, field, 0);
        }
    } catch (error) {
        console.log('incPostStatistics Failed --Pservices 52');
    }

}

async function getRedisPostProfile(postId) {
    try {
        const key = JSON.stringify(postId) + ' Profile';
        let postInfo = await redisPosts.get(key);
        if (!postInfo) {
            return null;
        }
        postInfo = JSON.parse(postInfo);
        return postInfo;
    } catch (error) {
        console.log('getRedisPostProfile Failed -- Pservices 65');
    }
}
async function saveRedisPostProfile(postId, postInfo) {
    try {
        const key = JSON.stringify(postId) + ' Profile';
        postInfo = stringifyPostInfo(postInfo);
        await redisPosts.setex(key, 20, postInfo);
    } catch (error) {
        console.log('saveRedisPostProfile -- Pservices 78');
    }
}
function addUserPostInfo(post, followingList, likeList, saveList) {
    try {
        if (followingList != null) {
            let following = followingList.
                filter(e => e.followedUser.equals(post.author._id)).length > 0;
            post.author = { ...post.author, following };
        }
        const like = likeList
            .filter(e => (e.post.equals(post._id) && e.like)).length > 0;
        const dislike = likeList
            .filter(e => (e.post.equals(post._id) && !e.like)).length > 0;
        const save = saveList.filter(e => e.post.equals(post._id)).length > 0
        post = { ...post, like, dislike, save };
        return post;
    } catch (error) {
        console.log('addUserPostInfo Faild -- Pservices 95');
    }
}

async function postTrendingInc(postId, incNum) {
    try {
        const data = await redisTrending.zscore(' PostTrending', postId);
        if (data) {
            if (Number(data) + incNum >= 0) {
                await redisTrending.zincrby(' PostTrending', incNum, postId);
            }
            return data;
        }
        incNum = incNum < 0 ? 0 : incNum;
        await redisTrending.zadd(' PostTrending', incNum, postId);
        return data;
    } catch (error) {
        console.log('trendingIncFiled -- Pservices 114');
    }

}

async function getPostTrending(num) {
    try {
        const trending = await redisTrending.zrevrange(' PostTrending', 0, -1, 'withscores');
        const topPosts = trending.slice(0, num * 2);
        let leaderBoard = [];
        topPosts.forEach((postId, index) => {
            if (index % 2 === 0) {
                const popularity = topPosts[index + 1];
                leaderBoard.push({ postId, popularity });
            }
        })
        leaderBoard = await Promise.all(
            leaderBoard.map(async (ranking) => {
                const post = await Post.findById(ranking.postId,
                    { title: 1, views: 1, commentCount: 1 })
                    .lean()
                    .populate('author', { username: 1, avatar: 1 }, { lean: true });
                leaderBoard.pop(ranking);
                const popularity = ranking.popularity;
                return { post, popularity };
            })
        )
        return leaderBoard;
    } catch (error) {
        console.log('getPostTrendingFailed -- Pservices 132');
    }
}


function clearTrendingByTime(time) {
    schedule.scheduleJob(time, async function (redisTrending) {
        try {
            await redisTrending.flushdb();
        } catch (error) {
            console.log('clearTrendingByTime Failed -- Pservices 161');
        }
    }.bind(null, redisTrending));
}

async function addPostStatistics(post) {
    try {
        const key = JSON.stringify(post._id) + ' Statiscs';
        const pipeline = redisPosts.pipeline();
        pipeline.hget(key, 'likes');
        pipeline.hget(key, 'dislikes');
        pipeline.hget(key, 'marks');
        pipeline.hget(key, 'comments');
        pipeline.hget(key, 'views');
        const results = await pipeline.exec();
        const likes = results[0][1] === null ? 0 : Number(results[0][1]);
        const dislikes = results[1][1] === null ? 0 : Number(results[1][1]);
        const marks = results[2][1] === null ? 0 : Number(results[2][1]);
        const comments = results[3][1] === null ? 0 : Number(results[3][1]);
        const views = results[4][1] === null ? 0 : Number(results[4][1]);
        const statistics = {
            likes, dislikes, marks,
            comments, views
        };
        post = { ...post, statistics }
        return post;
    } catch (error) {
        console.log('addPostStatistics Failed -- Pservices 171');
    }
}


async function beautyPostInfo(post, userId) {
    try {
        const [followingList, likeList, PostSaveList] = await Promise.all([
            Follow.find({ user: userId },
                { followedUser: 1, _id: 0 }).lean(),
            PostLike.find({ user: userId }, { post: 1, like: 1, _id: 0 }).lean(),
            SavedPost.find({ user: userId }, { post: 1, _id: 0 }).lean()
        ]);
        post = addUserPostInfo(post, followingList, likeList, PostSaveList)
        return post;
    } catch (error) {
        console.log('beautyPostInfo Failed -- Pservices 198');
    }
}


async function beautyPostsInfo(posts, userId, self = false) {
    try {
        const [followingList, likeList, saveList] = await Promise.all([
            Follow.find({ user: userId },
                { followedUser: 1, _id: 0 }).lean(),
            PostLike.find({ user: userId }, { post: 1, like: 1, _id: 0 }).lean(),
            SavedPost.find({ user: userId }, { post: 1, _id: 0 }).lean()
        ]);
        switch (self) {
            case false:
                posts.forEach((post, index) => {
                    posts[index] = addUserPostInfo(post, followingList, likeList, saveList);
                })
                break;
            default:
                posts.forEach((post, index) => {
                    posts[index] = addUserPostInfo(post, null, likeList, saveList);
                })
                break;
        }
        return posts;
    } catch (error) {
        console.log('beautyPostInfo Failed -- Pservices 214');
    }
}
async function addPostsStatistics(postList) {
    try {
        postList = await Promise.all(
            postList.map(async (post) => {
                post = await addPostStatistics(post);
                return post;
            }))
        return postList;
    } catch (error) {
        console.log('addPostsStatistics Failed -- Pservices 239');
    }
}
function postFilter(posts, timeInterval = 'default') {
    try {
        let start = new Date();
        let end = new Date();
        switch (timeInterval) {
            case 'a_day':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'a_week':
                start.setDate(start.getDate() - 7);
                break;
            case 'a_month':
                start.setMonth(start.getMonth() - 1);
                break;
            case 'three_month':
                start.setMonth(start.getMonth() - 3);
            case 'half_a_year':
                start.setMonth(start.getMonth() - 6);
            case 'a_year':
                start.setFullYear(start.getFullYear() - 1);
            default:
                start.setFullYear(2021);
                break;
        }
        posts = posts.filter(post => post.publishDate > start && post.publishDate < end);
        return posts;
    } catch (error) {
        console.log('getPosts Failed -- Pservices 251');
    }
}
export {
    getOnePostInfo, stringifyPostInfo, getRedisPostProfile,
    saveRedisPostProfile, addUserPostInfo, postTrendingInc,
    getPostTrending, clearTrendingByTime, addPostStatistics,
    addCommentsStatistics, beautyPostInfo, incPostStatistics,
    beautyPostsInfo, addPostsStatistics, postFilter
};