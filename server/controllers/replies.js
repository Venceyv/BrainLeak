import { Reply, ReplyLike, User } from "../models/index.js";
import { sortWith } from "../services/arraySorter.js";
import { incCommentStatistics } from "../services/commentServices.js";
import {
  addRepliesStatistics,
  addRepliesUserInfo,
  addReplyStatistics,
  addReplyUserInfo,
  changeReplyStats,
  getRedisReplyProfile,
  incReplyStatistics,
  saveRedisReplyProfile,
} from "../services/replyServices.js";
import { incUserNotification } from "../services/userServices.js";
async function replyToComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const comment = req.comment;
    const [dbBack] = await Promise.all([
      new Reply({
        content: req.body.content,
        relatedComment: comment._id,
        relatedPost: req.params.postId,
        mentionedUser: comment.author,
        author: req.user._id,
      }).save(),
      incCommentStatistics(req.params.commentId, "replies", 1),
      incUserNotification(comment.author, "replies", 1),
    ]);
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function deleteReply(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    await Promise.all([
      incCommentStatistics(req.params.commentId, "replies", -1),
      Reply.findByIdAndDelete(req.params.replyId),
      ReplyLike.deleteMany({ reply: req.params.replyId }),
    ]);
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
    const [likedReply, author] = await Promise.all([
      ReplyLike.findOne({ user: userId, reply: replyId }, { like: 1 }),
      User.findById(req.reply.author, { avatar: 1, username: 1 }).lean(),
    ]);
    let like = true;
    let dbBack, reply;
    if (likedReply && likedReply.like) {
      like = false;
      likedReply.remove();
      await changeReplyStats(req.reply, -1, -4, -1);
    } else {
      await Promise.all([changeReplyStats(req.reply, 1, 4, 1), incUserNotification(req.reply.author, "likes", 1)]);
      if (likedReply) {
        likedReply.like = true;
        likedReply.save();
        await incReplyStatistics(replyId, "dislikes", -1);
      } else {
        new ReplyLike({ user: userId, reply: replyId, replyAuthor: req.reply.author }).save();
      }
    }
    reply = await addReplyStatistics(req.reply);
    reply.author = author;
    dbBack = { ...reply, like };
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function dislikeReply(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const replyId = req.params.replyId;
    const userId = req.user._id;
    const [dislikedReply, author] = await Promise.all([
      ReplyLike.findOne({ user: userId, reply: replyId }, { like: 1 }),
      User.findById(req.reply.author, { avatar: 1, username: 1 }).lean(),
    ]);
    let dislike = true;
    let dbBack, reply;
    if (dislikedReply && !dislikedReply.like) {
      dislike = false;
      dislikedReply.remove();
      await incReplyStatistics(replyId, "dislikes", -1);
    } else {
      await incReplyStatistics(replyId, "dislikes", 1);
      if (dislikedReply) {
        dislikedReply.like = false;
        dislikedReply.save();
        await changeReplyStats(req.reply, -1, -4, -1);
      } else {
        new ReplyLike({ user: userId, reply: replyId, replyAuthor: req.reply.author, like: false }).save();
      }
    }
    reply = await addReplyStatistics(req.reply);
    reply.author = author;
    dbBack = { ...reply, dislike };
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
async function getReplies(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const commentId = req.params.commentId;
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    const order = req.query.sort;
    let dbBack = await getRedisReplyProfile(commentId);
    if (!dbBack) {
      dbBack = await Reply.find({ relatedComment: commentId })
        .lean()
        .populate("mentionedUser", { username: 1 }, { lean: true })
        .populate("author", { username: 1, avatar: 1 }, { lean: true });
    }
    if (dbBack.length != 0) {
      saveRedisReplyProfile(commentId, dbBack);
      dbBack = await addRepliesStatistics(dbBack);
      dbBack = sortWith(dbBack, order);
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
      if (req.user) {
        dbBack = await addRepliesUserInfo(req.user._id, dbBack);
      }
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
    const dbBack = await Promise.all([
      new Reply({
        content: req.body.content,
        relatedComment: comment._id,
        relatedPost: req.params.postId,
        mentionedUser: req.params.userId,
        author: req.user._id,
      }).save(),
      incCommentStatistics(req.params.commentId, "replies", 1),
      incUserNotification(req.params.userId, "replies", 1),
    ]);

    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
//get reply
async function getReply(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    let reply = req.reply;
    let [author, dbBack] = await Promise.all([
      User.findById(reply.author, { username: 1, avatar: 1 }).lean(),
      addReplyStatistics(reply),
    ]);
    dbBack.author = author;
    if (req.user) {
      const replyLikedList = await ReplyLike.find({ user: req.user._id }, { reply: 1, like: 1, _id: 0 }).lean();
      dbBack = addReplyUserInfo(dbBack, replyLikedList);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.status(401).json({ error: error });
  }
}
export { replyToComment, deleteReply, likeReply, dislikeReply, getReplies, replyToUser, getReply };
