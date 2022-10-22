import { User, Comment, CommentLike } from "../models/index.js";
import { transpoter, notifyAuthor } from "../services/nodeMailer.js";
import {
  addCommentsStatistics,
  getCommentsUderPost,
  incCommentStatistics,
  beautyCommentsInfo,
} from "../services/commentServices.js";
import { incUserStatistics, userTrendingInc } from "../services/userServices.js";
import { incPostStatistics, postTrendingInc } from "../services/postServices.js";
async function addComment(req, res) {
  try {
    const [postAuthor] = await Promise.all([
      User.findById(req.post.author, { email:1 }).lean(),
      postTrendingInc(req.post._id, 3),
      incPostStatistics(req.post._id, "comments", 1),
      incUserStatistics(req.params.userId, "comments", 1),
    ]);
    const dbBack = await new Comment({
      content: req.body.content,
      author: req.user._id,
      relatedPost: req.post._id,
    }).save();
    const accessToken = req.accessToken;
    //if author account is still active
    if (req.post.put && postAuthor && req.userId !== postAuthor._id) {
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
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    res.json({ error: error });
  }
}

async function updateComment(req, res) {
  try {
    const accessToken = req.accessToken;
    req.body.edited = true;
    req.body.updateTime = Date.now();
    const dbBack = await Comment.findByIdAndUpdate(req.comment._id, req.body, { new: true });
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    return res.status(401).json({ error });
  }
}
async function deleteComment(req, res) {
  try {
    await Promise.all([
      Comment.findByIdAndDelete(req.params.commentId),
      CommentLike.findOneAndDelete({ comment: req.params.commentId }),
      postTrendingInc(req.params.postId, -3),
      req.comment.relatedPost,
      incUserStatistics(req.comment.relatedPost, "comments", -1),
    ]);
    const accessToken = req.accessToken;
    const msg = "Delete successfully.";
    return res.status(200).json({ msg, accessToken });
  } catch (error) {
    return res.status(401).json({ error });
  }
}
async function likeComment(req, res) {
  try {
    let like = true;
    const accessToken = req.accessToken;
    const commentId = req.params.commentId;
    const userId = req.user._id;
    const dbBack = await CommentLike.findOne({ user: userId, comment: commentId }, { like: 1 });
    if (dbBack && dbBack.like) {
      like = false;
      dbBack.remove();
      await Promise.all([
        userTrendingInc(req.comment.author, -6),
        incCommentStatistics(commentId, "likes", -1),
        incUserStatistics(req.post.author, "upvotes", -1),
      ]);
      return res.status(200).json({ like, accessToken });
    }
    await Promise.all([
      incCommentStatistics(commentId, "likes", 1),
      userTrendingInc(req.comment.author, 6),
      incUserStatistics(req.post.author, "upvotes", 1),
    ]);
    if (dbBack) {
      dbBack.like = true;
      dbBack.save();
      await incCommentStatistics(commentId, "dislikes", -1);
      return res.status(200).json({ like, accessToken });
    }
    await new CommentLike({ user: userId, comment: commentId }).save();
    return res.status(200).json({ like, accessToken });
  } catch (error) {
    return res.status(401).json({ error });
  }
}
async function dislikeComment(req, res) {
  try {
    let dislike = true;
    const commentId = req.params.commentId;
    const accessToken = req.accessToken;
    const userId = req.user._id;
    const dbBack = await CommentLike.findOne({ user: userId, comment: commentId }, { like: 1 });
    if (dbBack && !dbBack.like) {
      dislike = false;
      dbBack.remove();
      await incCommentStatistics(commentId, "dislikes", -1);
      return res.status(200).json({ dislike, accessToken });
    }
    await incCommentStatistics(commentId, "dislikes", 1);
    if (dbBack) {
      dbBack.like = false;
      dbBack.save();
      await Promise.all([
        incCommentStatistics(commentId, "likes", -1),
        userTrendingInc(req.comment.author, -6),
        incUserStatistics(req.post.author, "upvotes", -1),
      ]);
      return res.status(200).json({ dislike, accessToken });
    }
    await new CommentLike({ user: userId, comment: commentId, like: false }).save();
    return res.status(200).json({ dislike, accessToken });
  } catch (error) {
    return res.status(401).json({ error });
  }
}
async function getComments(req, res) {
  try {
    const accessToken = req.accessToken;
    const order = req.query.sort;
    let dbBack = await getCommentsUderPost(req.params.postId);
    if (dbBack.length != 0) {
      const [comments] = await Promise.all([
        addCommentsStatistics(dbBack),
        postTrendingInc(req.params.postId, 1),
        incPostStatistics(req.params.postId, "views", 1),
        userTrendingInc(req.post.author, 1),
      ]);
      dbBack = comments;
      if (req.user) {
        dbBack = await beautyCommentsInfo(dbBack, req.user._id);
      }
      switch (order) {
        case "latest":
          dbBack.sort((a, b) => {
            return new Date(b.createTime) - new Date(a.createTime);
          });
          break;
        default:
          dbBack.sort((a, b) => {
            return b.statistics.likes - a.statistics.likes;
          });
          break;
      }
    }
    return res.status(200).json({ dbBack, accessToken });
  } catch (error) {
    return res.status(401).json({ error });
  }
}

export { addComment, updateComment, deleteComment, likeComment, dislikeComment, getComments };
