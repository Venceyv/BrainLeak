import { Router } from "express";
import {createPost,findOne,findByTags,findAll,
    findBySearch,updatePost,deletePost,likePost,
    dislikePost,savePost,postTrending} from '../controllers/posts.js';
import { addComment,deleteComment,dislikeComment,getComments,likeComment,updateComment } from "../controllers/comments.js";
import { checkPostAuth,checkPostExist } from "../middleware/validator/postMiddleware.js";
import { checkCommentAuth,checkCommentExist } from "../middleware/validator/commentMiddleware.js";
import { checkReplyAuth,checkReplyExist } from "../middleware/validator/replyMiddleware.js";
import {verifyToken} from '../services/jwt.js';
import {postValidator} from '../middleware/validator/postValidator.js';
import {commentValidator} from '../middleware/validator/commentValidator.js'
import { replyValidator } from "../middleware/validator/replyValidator.js";
import { replyToComment, deleteReply, likeReply, dislikeReply, getReplies } from "../controllers/replies.js";

const postRouter = Router();

postRouter.get('/',verifyToken(false),findAll);
postRouter.get('/trending',verifyToken(false),postTrending);
postRouter.get('/search',verifyToken(false),findBySearch);
postRouter.get('/tags',verifyToken(false),findByTags);
postRouter.get('/:postId',checkPostExist,verifyToken(false),findOne);
postRouter.get('/:postId/:commentId/replies',checkPostExist,checkCommentExist,verifyToken(false),getReplies);
postRouter.get('/comments/:postId',verifyToken(false),checkPostExist,getComments);
postRouter.get('/like/:postId',checkPostExist,verifyToken(),likePost);
postRouter.get('/dislike/:postId',checkPostExist,verifyToken(),dislikePost);
postRouter.get('/like/:postId/:commentId',checkPostExist,checkCommentExist,verifyToken(),likeComment);
postRouter.get('/dislike/:postId/:commentId',checkPostExist,checkCommentExist,verifyToken(),dislikeComment);
postRouter.get('/like/:postId/:commentId/:replyId',checkPostExist,checkCommentExist,checkReplyExist,verifyToken(),likeReply);
postRouter.get('/dislike/:postId/:commentId/:replyId',checkPostExist,checkCommentExist,checkReplyExist,verifyToken(),dislikeReply);
postRouter.get('/save/:postId',checkPostExist,verifyToken(),savePost);

postRouter.post('/',verifyToken(),postValidator,createPost);
postRouter.post('/:postId/comment',checkPostExist,verifyToken(),commentValidator,addComment);
postRouter.post('/:postId/comment/:commentId/reply',checkPostExist,checkCommentExist,
verifyToken(),replyValidator,replyToComment);

//reply to replies undercomment

postRouter.put('/:postId',checkPostExist,verifyToken(),checkPostAuth,postValidator,updatePost);
postRouter.put('/:postId/comment/:commentId',checkPostExist,
checkCommentExist,verifyToken(),checkCommentAuth,commentValidator,updateComment);

postRouter.delete('/:postId',checkPostExist,verifyToken(),checkPostAuth,deletePost);
postRouter.delete('/:postId/comment/:commentId',checkPostExist,
checkCommentExist,verifyToken(),checkCommentAuth,deleteComment);
postRouter.delete('/:postId/comment/:commentId/reply/:replyId',checkPostExist,
checkCommentExist,checkReplyExist,verifyToken(),checkReplyAuth,deleteReply);
export {postRouter}