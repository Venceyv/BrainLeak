import { User, Comment, CommentLike, Follow } from "../models/index.js";
import { transpoter, notifyAuthor } from "../services/nodeMailer.js";
import {
  addCommentsStatistics,
  getCommentsUderPost,
  incCommentStatistics,
  beautyCommentsInfo,
  addCommentStatistics,
  addCommentUserInfo,
} from "../services/commentServices.js";
import { incUserNotification, incUserStatistics, userTrendingInc } from "../services/userServices.js";
import { incPostStatistics, postTrendingInc } from "../services/postServices.js";
import { sortWith } from "../services/arraySorter.js";
async function addComment(req, res) {
  try {
    res.setHeader("Content-Type", "application/json");
    const userId = req.user._id;
    const postId = req.params.postId;
    const post = req.post;
    const postAuthor = await User.findById(req.post.author, { email: 1 }).lean();
    postTrendingInc(postId, 3);
    incPostStatistics(postId, "comments", 1);
    incUserStatistics(userId, "comments", 1);
    incUserNotification(post.author, "comments", 1);
    const dbBack = await new Comment({
      content: req.body.content,
      author: userId,
      relatedPost: postId,
      postAuthor: post.author,
    }).save();
    //if author account is still active
    if (req.post.put && postAuthor && !req.user._id.equals(postAuthor._id)) {
      const mailOptions = notifyAuthor(
        postAuthor.email,
        req.user.username,
        req.body.content,
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
    Comment.findByIdAndDelete(commentId);
    CommentLike.findOneAndDelete({ commentId });
    postTrendingInc(req.params.postId, -3);
    incPostStatistics(comment.relatedPost, "comments", -1);
    incUserStatistics(comment.author, "comments", -1);
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
    const comment = req.comment;
    const dbBack = await CommentLike.findOne({ user: userId, comment: commentId }, { like: 1 });
    if (dbBack && dbBack.like) {
      like = false;
      dbBack.remove();
      userTrendingInc(comment.author, -6);
      incCommentStatistics(commentId, "likes", -1);
      incUserStatistics(comment.author, "upvotes", -1);
      return res.status(200).json({ like });
    }
    incCommentStatistics(commentId, "likes", 1);
    userTrendingInc(comment.author, 6);
    incUserStatistics(comment.author, "upvotes", 1);
    incUserNotification(comment.author, "likes", 1);
    if (dbBack) {
      dbBack.like = true;
      dbBack.save();
      incCommentStatistics(commentId, "dislikes", -1);
      return res.status(200).json({ like });
    }
    new CommentLike({ user: userId, comment: commentId, commentAuthor: comment.author }).save();
    return res.status(200).json({ like });
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
    const comment = req.comment;
    const dbBack = await CommentLike.findOne({ user: userId, comment: commentId }, { like: 1 });
    if (dbBack && !dbBack.like) {
      dislike = false;
      dbBack.remove();
      incCommentStatistics(commentId, "dislikes", -1);
      return res.status(200).json({ dislike });
    }
    incCommentStatistics(commentId, "dislikes", 1);
    if (dbBack) {
      dbBack.like = false;
      dbBack.save();
      incCommentStatistics(commentId, "likes", -1);
      userTrendingInc(comment.author, -6);
      incUserStatistics(comment.author, "upvotes", -1);
      return res.status(200).json({ dislike });
    }
    new CommentLike({ user: userId, comment: commentId, commentAuthor: comment.author, like: false }).save();
    return res.status(200).json({ dislike });
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
      const comments = await addCommentsStatistics(dbBack);
      postTrendingInc(req.params.postId, 1),
      incPostStatistics(req.params.postId, "views", 1),
      userTrendingInc(req.post.author, 1)
      dbBack = comments;
      if (req.user) {
        dbBack = await beautyCommentsInfo(dbBack, req.user._id);
      }
      dbBack = sortWith(dbBack, order);
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
    let dbBack = await Comment.findById(req.params.commentId)
      .lean()
      .populate("author", { username: 1, avatar: 1 }, { lean: true });
    dbBack = await addCommentStatistics(dbBack);
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
export { addComment, updateComment, deleteComment, likeComment, dislikeComment, getComments, getComment };
