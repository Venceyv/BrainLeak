import { User } from '../models/index.js'
import { uploadFile } from './uploadFile.js'
import { redisUsers } from '../configs/redis.js';
import { addCommentsStatistics } from './commentServices.js';
import { redisTrending } from '../configs/redis.js';
import fastJson from 'fast-json-stringify';

const stringifyUserProfile = fastJson(
    {
        type: 'object'
        , properties: {
            userInfo: {
                type: 'object'
                , properties: {
                    _id: { type: 'string' }
                    , avatar: { type: 'string' }
                    , username: { type: 'string' }
                    , email: { type: 'string' }
                    , introduction: { type: 'string' }
                    , backgroundCover: { type: 'string' }
                    , __v: { type: 'integer' }
                }
            }
            , commentList: { type: 'array' }
        }
    }
);


const stringifyUserInfo = fastJson({
    _id: { type: 'string' },
    username: { type: 'string' },
    email: { type: 'string' }
});

async function updatePicture(req, res, name) {
    const accessToken = req.accessToken;
    try {
        const url = uploadFile(req, res);
        if (url) {
            let dbBack;
            switch (name) {
                case "avatar":
                    {
                        dbBack = await User.findByIdAndUpdate(req.user._id, { avatar: url }, { new: 1 });
                        break;
                    }

                default:
                    {
                        dbBack = await User.findByIdAndUpdate(req.user._id, { backgroundCover: url }, { new: 1 });
                        break;
                    }
            }
            return res.status(200).json({dbBack,accessToken});
        }
        res.status(401);
        throw 'unauthorized';

    } catch (error) {
        res.json(error);
    }
}
async function getRedisUserProfile(userId) {
    try {
        userId = JSON.stringify(userId);
        const key = userId + ' Profile';
        let userInfo = await redisUsers.get(key);
        if (userInfo) {
            userInfo = JSON.parse(userInfo);
            return userInfo;
        }
        return null;
    } catch (error) {
        console.log('getRedisUserProfileFailed Uservice 58');
    }
}
async function saveRedisUserProfile(userId, userInfo) {
    try {
        userId = JSON.stringify(userId);
        const key = userId + ' Profile';
        userInfo = stringifyUserProfile(userInfo);
        await redisUsers.setex(key, 40, userInfo);
    } catch (error) {
        console.log('saveRedisUserProfile Failed Uservice 72');
    }
}

async function getRedisUserInfo(email) {
    try {

        let userInfo = await redisUsers.get(email);
        if (userInfo) {
            userInfo = JSON.parse(userInfo);
            return userInfo;
        }
        return null;
    } catch (error) {
        console.log('getUserInfoRedis Failed Uservice 83');
    }
}
async function saveRedisUserInfo(email, userInfo) {
    try {
        userInfo = stringifyUserInfo(userInfo);
        await redisUsers.setex(email, 30, userInfo);
    } catch (error) {
        console.log('saveRedisUserInfo Failed Uservice 96');
    }
}


async function saveRedisSavedPost(userId, savedPost) {
    try {
        const key = JSON.stringify(userId) + ' SavedPost';
        savedPost = JSON.stringify(savedPost);
        await redisUsers.setex(key, 20, savedPost);
    } catch (error) {
        console.log('saveRedisSavedPost Failed, --Uservices 115');
    }
}
async function getRedisSavedPost(userId) {
    try {
        const key = JSON.stringify(userId) + ' SavedPost';
        let post = await redisUsers.get(key);
        if (!post) {
            return null;
        }
        post = JSON.parse(post);
        return post;
    } catch (error) {
        console.log('getRedisSavedPost Failed, --Uservices 124');
    }
}

async function saveRedisLikedPost(userId, likedPost) {
    try {
        const key = JSON.stringify(userId) + ' LikedPost';
        likedPost = JSON.stringify(likedPost);
        await redisUsers.setex(key, 20, likedPost);
    } catch (error) {
        console.log('saveRedisLikedPost Failed, --Uservices 146');
    }
}
async function getRedisLikedPost(userId) {
    try {
        const key = JSON.stringify(userId) + ' LikedPost';
        let post = await redisUsers.get(key);
        if (!post) {
            return null;
        }
        post = JSON.parse(post);
        return post;
    } catch (error) {
        console.log('getRedisLikedPost Failed, --Uservices 155');
    }
}

async function saveRedisDisikedPost(userId, dislikedPost) {
    try {
        const key = JSON.stringify(userId) + ' DislikedPost';
        dislikedPost = JSON.stringify(dislikedPost);
        await redisUsers.setex(key, 20, dislikedPost);
    } catch (error) {
        console.log('saveRedisDisikedPost Failed, --Uservices 177');
    }
}
async function getRedisDislikedPost(userId) {
    try {
        const key = JSON.stringify(userId) + ' DislikedPost';
        let post = await redisUsers.get(key);
        if (!post) {
            return null;
        }
        post = JSON.parse(post);
        return post;
    } catch (error) {
        console.log('getRedisDislikedPost Failed, --Uservices 186');
    }
}

async function incUserStatistics(userId, field, incNum) {
    try {
        userId = JSON.stringify(userId);
        const key = userId + ' Statistics';
        const result = await redisUsers.hincrby(key, field, incNum);
        if (result < 0) {
            await redisUsers.hset(key, field, 0);
        }
    } catch (error) {
        console.log('incUserStatistics Failed -- Uservices 208');
    }
}

function addFollowingInfo(targetUser, followingList) {
    try {
        const following = followingList
            .filter(e => e.followedUser.equals(targetUser._id)).length > 0;
        targetUser = { ...targetUser, following };
        return targetUser;
    } catch (error) {
        console.log('addFollowingInfoFailed -- Uservices 221');
    }
}

async function addUserStatistics(user) {
    try {
        const key = JSON.stringify(user._id) + ' Statistics';
        const pipeline = redisUsers.pipeline();
        pipeline.hget(key, "following");
        pipeline.hget(key, "follower");
        pipeline.hget(key, "posts");
        pipeline.hget(key, "comments");
        pipeline.hget(key, "upvotes");
        const results = await pipeline.exec();
        const following = results[0][1] === null ? 0 : Number(results[0][1]);
        const follower = results[1][1] === null ? 0 : Number(results[1][1]);
        const posts = results[2][1] === null ? 0 : Number(results[2][1]);
        const comments = results[3][1] === null ? 0 : Number(results[3][1]);
        const upvotes = results[4][1] === null ? 0 : Number(results[4][1]);
        const statistics = {
            following, follower, posts
            , comments, upvotes, following
        };
        user = { ...user, statistics };
        return user;
    } catch (error) {
        console.log('addUserStatistics Failed -- Uservices 232');
    }
}


async function userTrendingInc(userId, incNum) {
    try {
        const data = await redisTrending.zscore(' UserTrending', userId);
        if (data) {
            if (Number(data) + incNum >= 0) {
                await redisTrending.zincrby(' UserTrending', incNum, userId);
            }
            return data;
        }
        incNum = incNum < 0 ? 0 : incNum;
        await redisTrending.zadd(' UserTrending', incNum, userId);
        return data;
    } catch (error) {
        console.log('userTrendingInc Filed -- Uservices 271');
    }

}


async function getUserTrending(num) {
    try {
        const trending = await redisTrending.zrevrange(' UserTrending', 0, -1, 'withscores');
        const topUsers = trending.slice(0, num * 2);
        let leaderBoard = [];
        topUsers.forEach((userId, index) => {
            if (index % 2 === 0) {
                const popularity = topUsers[index + 1];
                leaderBoard.push({ userId, popularity });
            }
        })
        leaderBoard = await Promise.all(
            leaderBoard.map(async (ranking) => {
                const user = await User.findById(ranking.userId,
                    { avatar: 1, username: 1, backgroundCover: 1 })
                    .lean();
                leaderBoard.pop(ranking);
                const popularity = ranking.popularity;
                return { user, popularity };
            })
        )
        return leaderBoard;
    } catch (error) {
        console.log('getUserTrending Failed -- Uservices 290');
    }
}

async function getRedisUserComment(userId) {
    try {
        const key = JSON.stringify(userId) + ' Comment';
        let comment = await redisUsers.get(key);
        if (!comment) {
            return null;
        }
        comment = JSON.parse(comment);
        return comment;
    } catch (error) {
        console.log('getRedisUserComment Failed -- Uservices 317');
    }
}
async function saveRedisUserComment(userId, comments) {
    try {
        const key = JSON.stringify(userId) + ' Comment';
        comments = JSON.stringify(comments);
        await redisUsers.setex(key, 20, comments);
    } catch (error) {
        console.log('saveRedisUserComment Failed -- Uservices 330');
    }
}

async function getRedisUserPost(userId) {
    try {
        const key = JSON.stringify(userId) + ' Post';
        let post = await redisUsers.get(key);
        if (!post) {
            return null;
        }
        post = JSON.parse(post);
        return post;
    } catch (error) {
        console.log('getRedisUserPost Failed -- Uservices 348');
    }
}
async function saveRedisUserPost(userId, posts) {
    try {
        const key = JSON.stringify(userId) + ' Post';
        posts = JSON.stringify(posts);
        await redisUsers.setex(key, 20, posts);
    } catch (error) {
        console.log('saveRedisUserPost Failed -- Uservices 361');
    }
}




export {
    updatePicture, stringifyUserInfo, getRedisUserProfile,
    addFollowingInfo, addUserStatistics, getRedisUserInfo,
    saveRedisUserInfo, saveRedisUserProfile, incUserStatistics,
    userTrendingInc, getUserTrending, saveRedisSavedPost,
    getRedisSavedPost, getRedisLikedPost, saveRedisLikedPost, getRedisDislikedPost,
    saveRedisDisikedPost, getRedisUserComment, saveRedisUserComment,
    getRedisUserPost, saveRedisUserPost

};