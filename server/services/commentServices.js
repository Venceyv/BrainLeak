import schedule from 'node-schedule';
import { redisComments } from '../configs/redis.js';
import { Post, Comment, CommentLike, Follow } from '../models/index.js';

function clearCommentByTime(time) {
    schedule.scheduleJob(time, async function (Comment) {
        try {
            const commentList = await Comment.find();
            await Promise.all(commentList.map(async function (comment) {
                const record = await Post.findById(comment.relatedPost,{_id:1}).lean();
                if (!record) {
                    await Comment.findByIdAndDelete(comment._id);
                }
            }))
        } catch (error) {
            console.log('clearCommentByTimeFailed -- Cservices 5');
        }
    }.bind(null, Comment));
}
async function incCommentStatistics(commentId, field, incNum) {
    try {
        const key = JSON.stringify(commentId) + ' Statistics';
        const result = await redisComments.hincrby(key, field, incNum);
        if (result < 0) {
            await redisComments.hset(key, field, 0);
        }
    } catch (error) {
        console.log('incCommentStatistics Failed -- Cservices 20');
    }
}
async function addCommentStatistics(comment) {
    try {
        const commentId = JSON.stringify(comment._id) + ' Statistics';
        const pipeline = redisComments.pipeline();
        pipeline.hget(commentId, 'likes');
        pipeline.hget(commentId, 'dislikes');
        pipeline.hget(commentId, 'replies');
        const results = await pipeline.exec();
        const likes = results[0][1] === null ? 0 : Number(results[0][1]);
        const dislikes = results[1][1] === null ? 0 : Number(results[1][1]);
        const replies = results[2][1] === null ? 0 : Number(results[2][1]);
        const statistics = { likes, dislikes, replies };
        return { ...comment, statistics };
    } catch (error) {
        console.log('addCommentStatistics Failed -- Cservices 31');
    }
}
function addCommentUserInfo(comment, followingList, likeList) {
    try {
        if (followingList != null) {
            let following = followingList
                .filter(e => e.followedUser.equals(comment.author._id)).length > 0;
            comment.author = { ...comment.author, following };
        }
        const like = likeList
            .filter(e => e.comment.equals(comment._id) && e.like).length > 0;
        const dislike = likeList
            .filter(e => e.comment.equals(comment._id) && !e.like).length > 0;
        comment = { ...comment, like, dislike };
        return comment;
    } catch (error) {
        console.log('addCommentUserInfo Failed -- Cservices 48');
    }
}

async function addCommentsStatistics(commentList) {
    try {
        commentList = await Promise.all(
            commentList.map(async (comment) => {
                comment = await addCommentStatistics(comment);
                return comment;
            }))
        return commentList;
    } catch (error) {
        console.log('addCommentsStatistics Failed -- Cservices 66');
    }
}
async function getCommentsUderPost(postId) {
    try {
        let commentUnderPost = await getRedisCommentProfile(postId);
        if (!commentUnderPost) {
            commentUnderPost = await Comment.find({ relatedPost: postId },
                { relatedPost: 0, edited: 0 })
                .lean()
                .populate('author', { username: 1, avatar: 1 }, { lean: true });
            if (commentUnderPost.length != 0) {
                await saveRedisCommentProfile(postId, commentUnderPost);
            }
        }
        return commentUnderPost;

    } catch (error) {
        console.log('getCommentsUderPost Failed -- Cservices 78');
    }
}
async function deleteRedisCommentProfile(postId) {
    try {
        const key = JSON.stringify(postId) + ' Profile';
        await redisComments.del(key);
    } catch (error) {
        console.log('deleteCommentProfile Faild --Cservices 96');
    }
}
async function saveRedisCommentProfile(postId, profile) {
    try {
        const key = JSON.stringify(postId) + ' Profile';
        profile = JSON.stringify(profile)
        await redisComments.set(key, profile);
    } catch (error) {
        console.log('saveRedisCommentProfile Faild --Cservices 104');
    }
}
async function getRedisCommentProfile(postId) {
    try {
        const key = JSON.stringify(postId) + ' Profile';
        let profile = await redisComments.get(key);
        if (!profile) {
            return null;
        }
        profile = JSON.parse(profile);
        return profile;
    } catch (error) {
        console.log('getRedisCommentProfile Faild --Cservices 113');
    }
}

async function beautyCommentsInfo(comments, userId, self = false) {
    try {
        const [commentLikeList, followingList] = await Promise.all([
            CommentLike.find({ user: userId },
                { comment: 1, like: 1, _id: 0 }).lean(),
            Follow.find({ user: userId },
                { followedUser: 1, _id: 0 }).lean()
        ])
        switch (self) {
            case false:
                comments.forEach((comment, index) => {
                    comments[index] = addCommentUserInfo(comment, followingList, commentLikeList);
                })
                break;
            default:
                comments.forEach((comment, index) => {
                    comments[index] = addCommentUserInfo(comment, null, commentLikeList);
                })
                break;
        }
        return comments;
    } catch (error) {
        console.log('beautyCommentsInfo Failed -- Cservices 127');
    }
}
export {
    clearCommentByTime, addCommentStatistics,
    addCommentUserInfo, addCommentsStatistics
    , getCommentsUderPost, incCommentStatistics
    , deleteRedisCommentProfile, beautyCommentsInfo
}