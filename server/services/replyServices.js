import schedule from "node-schedule";
import { redisReplies } from "../configs/redis.js";
import { Reply, Comment, ReplyLike } from "../models/index.js";
import { incCommentStatistics } from "./commentServices.js";
import { incUserStatistics, userTrendingInc } from "./userServices.js";
//clear reply that related post does not exist
function clearReplyByTime(time) {
  schedule.scheduleJob(
    time,
    async function (Reply) {
      try {
        const replyList = await Reply.find();
        await Promise.all(
          replyList.map(async function (reply) {
            const record = await Comment.findById(reply.relatedComment, { _id: 1 }).lean();
            if (!record) {
              await Reply.findByIdAndDelete(reply._id);
            }
          })
        );
      } catch (error) {
        console.log("addReplyStatisticsError -- Rservices 5");
      }
    }.bind(null, Reply)
  );
}
async function addReplyStatistics(reply) {
  try {
    if (reply) {
      const replyId = JSON.stringify(reply._id) + " Statistics";
      const pipeline = redisReplies.pipeline();
      pipeline.hget(replyId, "likes");
      pipeline.hget(replyId, "dislikes");
      const results = await pipeline.exec();
      const likes = results[0][1] === null ? 0 : Number(results[0][1]);
      const dislikes = results[1][1] === null ? 0 : Number(results[1][1]);
      const statistics = { likes, dislikes };
      reply = { ...reply, statistics };
    }
    return reply;
  } catch (error) {
    console.log("addReplyStatisticsError -- Rservices 20");
  }
}
async function incReplyStatistics(replyId, field, incNum) {
  try {
    const key = JSON.stringify(replyId) + " Statistics";
    const result = await redisReplies.hincrby(key, field, incNum);
    if (result < 0) {
      redisReplies.hset(key, field, 0);
    }
  } catch (error) {
    console.log("incReplyStatistics Failed -- Rservices 35");
  }
}
function addReplyUserInfo(reply, replyLikedList) {
  try {
    if (reply) {
      const like = replyLikedList.filter((e) => e.reply.equals(reply._id) && e.like).length > 0;
      const dislike = replyLikedList.filter((e) => e.reply.equals(reply._id) && !e.like).length > 0;
      reply = { ...reply, like, dislike };
    }
    return reply;
  } catch (error) {
    console.log("addReplyUserInfoE Faild --Rservices 47");
  }
}

function saveRedisReplyProfile(replyId, profile) {
  try {
    const key = JSON.stringify(replyId) + " Profile";
    profile = JSON.stringify(profile);
    redisReplies.setex(key, 3, profile);
  } catch (error) {
    console.log("saveRedisReplyProfile Faild --Rservices 69");
  }
}
async function getRedisReplyProfile(replyId) {
  try {
    const key = JSON.stringify(replyId) + " Profile";
    let profile = await redisReplies.get(key);
    if (!profile) {
      return null;
    }
    profile = JSON.parse(profile);
    return profile;
  } catch (error) {
    console.log("getRedisReplyProfile Faild --Rservices 78");
  }
}
async function addRepliesStatistics(replies) {
  replies = await Promise.all(
    replies.map(async (reply) => {
      reply = await addReplyStatistics(reply);
      return reply;
    })
  );
  return replies;
}
async function addRepliesUserInfo(userId, replies){
  try {
    const replyLikeList = await ReplyLike.find({ user: userId }, { _id: 0, like: 1,reply:1 }).lean();
    replies.forEach((reply, index) => {
      replies[index] = addReplyUserInfo(reply, replyLikeList);
    });
    return replies;
  } catch (error) {
    console.log("addRepliesUserInfo Faild --Rservices 99");
  }
}
async function updateReplyStats(reply, likes = 0, trending = 0, upvotes = 0) {
  const replyId = reply._id;
  await Promise.all([
    incReplyStatistics(replyId, "likes", likes),
    userTrendingInc(reply.author, trending),
    incUserStatistics(reply.author, "upvotes", upvotes),
  ])
}
export {
  clearReplyByTime,
  addReplyStatistics,
  addReplyUserInfo,
  incReplyStatistics,
  saveRedisReplyProfile,
  getRedisReplyProfile,
  addRepliesStatistics,
  addRepliesUserInfo,
  updateReplyStats,
};
