import { User, Comment, CommentLike, Post } from "../models/index.js";
import { transpoter, notifyAuthor } from "../services/nodeMailer.js";
import {
  addCommentsStatistics,
  getCommentsUderPost,
  incCommentStatistics,
  beautyCommentsInfo,
  addCommentStatistics,
  addCommentUserInfo,
  updateCommentStats,
  delRedisPinComment,
  saveRedisPinComment,
} from "../services/commentServices.js";
import { incUserNotification, incUserStatistics } from "../services/userServices.js";
import { incPostStatistics, postTrendingInc } from "../services/postServices.js";
import { sortWith } from "../services/arraySorter.js";
async function addComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const userId = req.user._id;
    const postId = req.params.postId;
    const post = req.post;
    const [postAuthor] = await Promise.all([
      User.findById(req.post.author, { email: 1 }).lean(),
      postTrendingInc(postId, 3),
      incPostStatistics(postId, "comments", 1),
      incUserStatistics(userId, "comments", 1),
      incUserNotification(post.author, "comments", 1),
    ]);
    const commentContent = req.body.content.replace(/<\/?.+?>/g, "");
    const dbBack = await new Comment({
      content: req.body.content,
      author: userId,
      relatedPost: postId,
      postAuthor: post.author,
    }).save();
    //if author account is still active
    if (req.post.notify && postAuthor && !req.user._id.equals(postAuthor._id)) {
      const mailOptions = notifyAuthor(
        postAuthor.email,
        req.user.username,
        commentContent,
        req.post.title,
        req.post.description
      );
      transpoter.sendMail(mailOptions, function (error, data) {
        if (error) {
          console.log("Nodemailer Failed -- Ccontrol 6");
        }
      });
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    res.json({ error: error });
  }
}

async function updateComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    req.body.edited = true;
    req.body.updateTime = Date.now();
    const dbBack = await Comment.findByIdAndUpdate(req.comment._id, req.body, { new: true });
    if(dbBack.pinned){
      saveRedisPinComment(dbBack.relatedPost,dbBack);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error });
  }
}
async function deleteComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const comment = req.comment;
    const commentId = req.params.commentId;
    await Promise.all([
      Comment.findByIdAndDelete(commentId),
      CommentLike.deleteMany({ commentId }),
      postTrendingInc(req.params.postId, -3),
      incPostStatistics(comment.relatedPost, "comments", -1),
      incUserStatistics(comment.author, "comments", -1),
      delRedisPinComment(req.comment.relatedPost),
    ]);
    const msg = "Delete successfully.";
    return res.status(200).json({ msg });
  } catch (error) {
    return res.status(401).json({ error });
  }
}
async function likeComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    let like = true;
    const commentId = req.params.commentId;
    const userId = req.user._id;
    const [likedcomment, author] = await Promise.all([
      CommentLike.findOne({ user: userId, comment: commentId }, { like: 1 }),
      User.findById(req.comment.author, { avatar: 1, username: 1 }).lean(),
    ]);
    let dbBack, comment;
    if (likedcomment && likedcomment.like) {
      like = false;
      likedcomment.remove();
      await updateCommentStats(req.comment, -1, -6, -1);
    } else {
      await Promise.all([
        updateCommentStats(req.comment, 1, 6, 1),
        incUserNotification(req.comment.author, "likes", 1),
      ]);
      if (likedcomment) {
        likedcomment.like = true;
        likedcomment.save();
        await incCommentStatistics(commentId, "dislikes", -1);
      } else {
        new CommentLike({ user: userId, comment: commentId, commentAuthor: req.comment.author }).save();
      }
    }
    comment = await addCommentStatistics(req.comment);
    comment.author = author;
    dbBack = { ...comment, like };
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error });
  }
}
async function dislikeComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    let dislike = true;
    const commentId = req.params.commentId;
    const userId = req.user._id;
    const [dislikedComment, author] = await Promise.all([
      CommentLike.findOne({ user: userId, comment: commentId }, { like: 1 }),
      User.findById(req.comment.author, { avatar: 1, username: 1 }).lean(),
    ]);
    let dbBack, comment;
    if (dislikedComment && !dislikedComment.like) {
      dislike = false;
      dislikedComment.remove();
      await incCommentStatistics(commentId, "dislikes", -1);
    } else {
      await incCommentStatistics(commentId, "dislikes", 1);
      if (dislikedComment) {
        dislikedComment.like = false;
        dislikedComment.save();
        await updateCommentStats(req.comment, -1, -6, -1);
      } else {
        new CommentLike({ user: userId, comment: commentId, commentAuthor: req.comment.author, like: false }).save();
      }
    }
    comment = await addCommentStatistics(req.comment);
    comment.author = author;
    dbBack = { ...comment, dislike };
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error });
  }
}
async function getComments(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const order = req.query.sort;
    const pageNum = Number(req.query.pagenumber);
    const pageSize = Number(req.query.pagesize);
    let dbBack = await getCommentsUderPost(req.params.postId);
    if (dbBack.length != 0) {
      dbBack = await addCommentsStatistics(dbBack);
      dbBack = sortWith(dbBack, order);
      if (req.user) {
        dbBack = await beautyCommentsInfo(dbBack, req.user._id);
      }
      dbBack = dbBack.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error });
  }
}
async function getComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const comment = req.comment;
    let [author, dbBack] = await Promise.all([
      User.findById(comment.author, { username: 1, avatar: 1 }).lean(),
      addCommentStatistics(comment),
    ]);
    dbBack.author = author;
    if (req.user) {
      const userId = req.user._id;
      const commentLikeList = await CommentLike.find({ user: userId }, { comment: 1, like: 1, _id: 0 }).lean();
      dbBack = addCommentUserInfo(dbBack, commentLikeList);
    }
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.status(401).json({ error });
  }
}
async function pinComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    if (!req.comment.relatedPost.equals(req.params.postId)) {
      res.status(403);
      throw "unauthorized";
    }
    const [dbBack, comment] = await Promise.all([
      Post.findById(req.params.postId, { pinnedComment: 1 }),
      Comment.findById(req.params.commentId, { pinned: 1,author:1,content:1 }),
    ]);
    if (dbBack.pinnedComment && dbBack.pinnedComment.equals(comment._id)) {
      dbBack.pinnedComment = null;
      await delRedisPinComment(req.params.postId);
      comment.pinned = false;
    } else {
      if (dbBack.pinnedComment) {
        await Comment.findByIdAndUpdate(dbBack.pinnedComment, { pinned: false });
      }
      dbBack.pinnedComment = comment._id;
      comment.pinned = true;
      saveRedisPinComment(req.params.postId,comment);
    }
    comment.save();
    dbBack.save();
    return res.status(200).json({ dbBack });
  } catch (error) {
    return res.json({ error: error });
  }
}
export { addComment, updateComment, deleteComment, likeComment, dislikeComment, getComments, getComment, pinComment };
