import { Router } from "express";
import {
  createPost,
  findOne,
  findByTags,
  findAll,
  findBySearch,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  savePost,
  postTrending,
  getAllTags,
} from "../controllers/posts.js";
import {
  addComment,
  deleteComment,
  dislikeComment,
  getComments,
  likeComment,
  updateComment,
} from "../controllers/comments.js";
import { checkPostAuth, checkPostExist } from "../middleware/postMiddleware.js";
import { checkCommentAuth, checkCommentExist } from "../middleware/commentMiddleware.js";
import { checkReplyAuth, checkReplyExist } from "../middleware/replyMiddleware.js";
import { verifyToken } from "../services/jwt.js";
import { postValidator } from "../middleware/validator/postValidator.js";
import { commentValidator } from "../middleware/validator/commentValidator.js";
import { replyValidator } from "../middleware/validator/replyValidator.js";
import { replyToComment, deleteReply, likeReply, dislikeReply, getReplies } from "../controllers/replies.js";

const postRouter = Router();

postRouter.get("/", verifyToken(false), findAll);
postRouter.get("/trending", verifyToken(false), postTrending);
postRouter.get("/search", verifyToken(false), findBySearch);
postRouter.get("/tags", verifyToken(false), findByTags);
postRouter.get("/allTags",getAllTags);
postRouter.get("/:postId", checkPostExist, verifyToken(false), findOne);
postRouter.get("/comments/:postId", verifyToken(false), checkPostExist, getComments);
postRouter.get("/replies/:postId/:commentId", checkPostExist, checkCommentExist, verifyToken(false), getReplies);

postRouter.post("/", verifyToken(), postValidator, createPost);
postRouter.post("/comment/:postId", checkPostExist, verifyToken(), commentValidator, addComment);
postRouter.post(
  "/comment/reply/:postId/:commentId",
  checkPostExist,
  checkCommentExist,
  verifyToken(),
  replyValidator,
  replyToComment
);

//reply to replies undercomment

postRouter.put("/:postId", checkPostExist, verifyToken(), checkPostAuth, postValidator, updatePost);
postRouter.put(
  "/comment/:postId/:commentId",
  checkPostExist,
  checkCommentExist,
  verifyToken(),
  checkCommentAuth,
  commentValidator,
  updateComment
);
postRouter.put("/like/:postId", checkPostExist, verifyToken(), likePost);
postRouter.put("/dislike/:postId", checkPostExist, verifyToken(), dislikePost);
postRouter.put("/save/:postId", checkPostExist, verifyToken(), savePost);
postRouter.put("/like/:postId/:commentId", checkPostExist, checkCommentExist, verifyToken(), likeComment);
postRouter.put("/dislike/:postId/:commentId", checkPostExist, checkCommentExist, verifyToken(), dislikeComment);
postRouter.put(
  "/like/:postId/:commentId/:replyId",
  checkPostExist,
  checkCommentExist,
  checkReplyExist,
  verifyToken(),
  likeReply
);
postRouter.put(
  "/dislike/:postId/:commentId/:replyId",
  checkPostExist,
  checkCommentExist,
  checkReplyExist,
  verifyToken(),
  dislikeReply
);

postRouter.delete("/:postId", checkPostExist, verifyToken(), checkPostAuth, deletePost);
postRouter.delete(
  "/comment/:postId/:commentId",
  checkPostExist,
  checkCommentExist,
  verifyToken(),
  checkCommentAuth,
  deleteComment
);
postRouter.delete(
  "/comment/reply/:postId/:commentId/:replyId",
  checkPostExist,
  checkCommentExist,
  checkReplyExist,
  verifyToken(),
  checkReplyAuth,
  deleteReply
);
export { postRouter };
