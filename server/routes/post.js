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
  getComment,
  getComments,
  likeComment,
  updateComment,
  pinComment,
} from "../controllers/comments.js";
import { checkPostAuth, checkPostExist } from "../middleware/postMiddleware.js";
import { checkCommentAuth, checkCommentExist } from "../middleware/commentMiddleware.js";
import { checkReplyAuth, checkReplyExist } from "../middleware/replyMiddleware.js";
import { verifyToken } from "../services/jwt.js";
import { postValidator } from "../middleware/validator/postValidator.js";
import { commentValidator } from "../middleware/validator/commentValidator.js";
import { replyValidator } from "../middleware/validator/replyValidator.js";
import {
  replyToComment,
  deleteReply,
  likeReply,
  dislikeReply,
  getReplies,
  replyToUser,
  getReply,
} from "../controllers/replies.js";
import { checkUserExist } from "../middleware/userMiddleware.js";

const postRouter = Router();

postRouter.get("/", verifyToken(false), findAll);
postRouter.get("/trending", postTrending);
postRouter.get("/search", verifyToken(false), findBySearch);
postRouter.get("/tags", verifyToken(false), findByTags);
postRouter.get("/allTags", getAllTags);
postRouter.get("/:postId", checkPostExist, verifyToken(false), findOne);
postRouter.get("/comments/:postId", verifyToken(false), checkPostExist, getComments);
postRouter.get("/comment/:postId/:commentId", checkPostExist, checkCommentExist, verifyToken(false), getComment);
postRouter.get("/comment/replies/:postId/:commentId", checkPostExist, checkCommentExist, verifyToken(false), getReplies);
postRouter.get(
  "/comment/reply/:postId/:commentId/:replyId",
  checkPostExist,
  checkCommentExist,
  checkReplyExist,
  verifyToken(false),
  getReply
);
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
postRouter.post(
  "/comment/reply/:postId/:commentId/:userId",
  checkPostExist,
  checkCommentExist,
  checkUserExist,
  verifyToken(),
  replyValidator,
  replyToUser
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
postRouter.put("/pinComment/:postId/:commentId",checkPostExist,checkCommentExist,verifyToken(),checkPostAuth,pinComment);

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
