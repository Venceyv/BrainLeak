import { Reply, ReplyLike } from "../models/index.js";
import { sortWith } from "../services/arraySorter.js";
import { incCommentStatistics } from "../services/commentServices.js";
import {
  addRepliesStatistics,
  addReplyStatistics,
  addReplyUserInfo,
  getRedisReplyProfile,
  incReplyStatistics,
  saveRedisReplyProfile,
} from "../services/replyServices.js";
import { userTrendingInc, incUserStatistics, incUserNotification } from "../services/userServices.js";
async function replyToComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const comment = req.comment;
    const dbBack = await new Reply({
      content: req.body.content,
      relatedComment: comment._id,
      relatedPost: req.params.postId,
      mentionedUser: comment.author,
      author: req.user._id,
    }).save();
    incCommentStatistics(req.params.commentId, "replies", 1);
    incUserNotification(comment.author, "replies", 1);
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function deleteReply(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    incCommentStatistics(req.params.commentId, "replies", -1);
    Reply.findByIdAndDelete(req.params.replyId);
    res.status(200).json({ msg: "delete successfully" });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function likeReply(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const replyId = req.params.replyId;
    const userId = req.user._id;
    const reply = req.reply;
    const dbBack = await ReplyLike.findOne({ user: userId, reply: replyId }, { like: 1 });
    let like = true;
    if (dbBack && dbBack.like) {
      like = false;
      dbBack.remove();
      incReplyStatistics(replyId, "likes", -1);
      userTrendingInc(req.reply.author, -4);
      incUserStatistics(req.reply.author, "upvotes", -1);
      return res.status(200).json({ like });
    }
    incReplyStatistics(replyId, "likes", 1);
    userTrendingInc(req.reply.author, 4);
    incUserStatistics(req.reply.author, "upvotes", 1);
    incUserNotification(req.reply.author, "likes", 1);
    if (dbBack) {
      dbBack.like = true;
      dbBack.save();
      await incReplyStatistics(replyId, "dislikes", -1);
      return res.status(200).json({ like });
    }
    new ReplyLike({ user: userId, reply: replyId, replyAuthor: reply.author }).save();
    return res.status(200).json({ like });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function dislikeReply(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const replyId = req.params.replyId;
    const userId = req.user._id;
    const reply = req.reply;
    const dbBack = await ReplyLike.findOne({ user: userId, reply: replyId }, { like: 1 });
    let dislike = true;
    if (dbBack && !dbBack.like) {
      dislike = false;
      dbBack.remove();
      incReplyStatistics(replyId, "dislikes", -1);
      return res.status(200).json({ dislike });
    }
    incReplyStatistics(replyId, "dislikes", 1);
    if (dbBack) {
      dbBack.like = false;
      dbBack.save();
      incReplyStatistics(replyId, "likes", -1);
      userTrendingInc(reply.author, -4);
      incUserStatistics(reply.author, "upvotes", -1);
      return res.status(200).json({ dislike });
    }
    new ReplyLike({ user: userId, reply: replyId, replyAuthor: reply.author, like: false }).save();
    return res.status(200).json({ dislike });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getReplies(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const commentId = req.params.commentId;
    const order = req.query.sort;
    let dbBack = await getRedisReplyProfile(commentId);
    if (!dbBack) {
      dbBack = await Reply.find({ relatedComment: commentId })
        .lean()
        .populate("mentionedUser", { username: 1, avatar: 1 }, { lean: true })
        .populate("author", { username: 1, avatar: 1 }, { lean: true });
    }
    if (dbBack.length != 0) {
      saveRedisReplyProfile(commentId, dbBack);
      if (req.user) {
        dbBack = await Promise.all(
          dbBack.map(async (reply) => {
            reply = await addReplyUserInfo(req.user._id, reply);
            return reply;
          })
        );
      }
      dbBack = await addRepliesStatistics(dbBack);
      dbBack = sortWith(dbBack, order);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function replyToUser(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const comment = req.comment;
    const dbBack = await new Reply({
      content: req.body.content,
      relatedComment: comment._id,
      relatedPost: req.params.postId,
      mentionedUser: req.params.userId,
      author: req.user._id,
    }).save();
    incCommentStatistics(req.params.commentId, "replies", 1);
    incUserNotification(req.params.userId, "replies", 1);
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
//get reply
async function getReply(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    let dbBack = await Reply.findById(req.params.replyId).lean();
    dbBack = await addReplyStatistics(dbBack);
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
export { replyToComment, deleteReply, likeReply, dislikeReply, getReplies, replyToUser, getReply };
