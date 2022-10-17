import schedule from 'node-schedule';
import { redisReplies } from '../configs/redis.js';
import { Reply, Comment, ReplyLike } from '../models/index.js';

function clearReplyByTime(time) {
    schedule.scheduleJob(time, async function (Reply) {
        try {
            const replyList = await Reply.find();
            await Promise.all(replyList.map(async function (reply) {
                const record = await Comment.findById(reply.relatedComment,{_id:1}).lean();
                if (!record) {
                    await Reply.findByIdAndDelete(reply._id);
                }
            }))
        } catch (error) {
            console.log('addReplyStatisticsError -- Rservices 5');
        }
    }.bind(null, Reply));
}
async function addReplyStatistics(reply) {
    try {
        const replyId = JSON.stringify(reply._id) + ' Statistics';
        const pipeline = redisReplies.pipeline();
        pipeline.hget(replyId, 'likes');
        pipeline.hget(replyId, 'dislikes');
        const results = await pipeline.exec();
        const likes = results[0][1] === null ? 0 : Number(results[0][1]);
        const dislikes = results[1][1] === null ? 0 : Number(results[1][1]);
        const statistics = { likes, dislikes };
        return { ...reply, statistics };
    } catch (error) {
        console.log('addReplyStatisticsError -- Rservices 20');
    }
}
async function incReplyStatistics(replyId, field, incNum) {
    try {
        const key = JSON.stringify(replyId) + ' Statistics';
        const result = await redisReplies.hincrby(key, field, incNum);
        if(result<0)
        {
            await redisReplies.hset(key,field,0);
        }
    } catch (error) {
        console.log('incReplyStatistics Failed -- Rservices 35');
    }
}
async function addReplyUserInfo(userId, reply) {
    try {
        const dbBack = await ReplyLike
            .findOne({ user: userId, reply: reply._id }, { _id:0,like: 1 })
            .lean();
        const like = dbBack===null?false:dbBack.like;
        const dislike = dbBack===null?false:!dbBack.like;
        reply = { ...reply, like, dislike };

        return reply;
    } catch (error) {
        console.log('addReplyUserInfoE Faild --Rservices 47');
    }
}
async function deleteRedisReplyProfile(replyId) {
    try {
        const key = JSON.stringify(replyId) + ' Profile';
        await redisReplies.del(key);
    } catch (error) {
        console.log('deleteRedisReplyProfile Faild --Rservices 59');
    }
}
async function saveRedisReplyProfile(replyId, profile) {
    try {
        const key = JSON.stringify(replyId) + ' Profile';
        profile = JSON.stringify(profile);
        await redisReplies.set(key, profile);
    } catch (error) {
        console.log('saveRedisReplyProfile Faild --Rservices 69');
    }
}
async function getRedisReplyProfile(replyId) {
    try {
        const key = JSON.stringify(replyId) + ' Profile';
        let profile = await redisReplies.get(key);
        if(!profile)
        {
            return null;
        }
        profile = JSON.parse(profile);
        return profile;
    } catch (error) {
        console.log('getRedisReplyProfile Faild --Rservices 78');
    }
}
export {
    clearReplyByTime, addReplyStatistics,
    addReplyUserInfo,incReplyStatistics,
    deleteRedisReplyProfile,saveRedisReplyProfile,
    getRedisReplyProfile
}