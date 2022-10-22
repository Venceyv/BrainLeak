import { Router } from "express";
import {createPost,findOne,findByTags,findAll,
    findBySearch,updatePost,deletePost,likePost,
    dislikePost,savePost,postTrending} from '../controllers/posts.js';
import { addComment,deleteComment,dislikeComment,getComments,likeComment,updateComment } from "../controllers/comments.js";
import { checkPostAuth,checkPostExist } from "../middleware/postMiddleware.js";
import { checkCommentAuth,checkCommentExist } from "../middleware/commentMiddleware.js";
import { checkReplyAuth,checkReplyExist } from "../middleware/replyMiddleware.js";
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
postRouter.get('/:postId/like',checkPostExist,verifyToken(),likePost);
postRouter.get('/:postId/dislike',checkPostExist,verifyToken(),dislikePost);
postRouter.get('/:postId/comments',verifyToken(false),checkPostExist,getComments);
postRouter.get('/:postId/save',checkPostExist,verifyToken(),savePost);
postRouter.get('/:postId/:commentId/replies',checkPostExist,checkCommentExist,verifyToken(false),getReplies);
postRouter.get('/:postId/:commentId/like',checkPostExist,checkCommentExist,verifyToken(),likeComment);
postRouter.get('/:postId/:commentId/dislike',checkPostExist,checkCommentExist,verifyToken(),dislikeComment);
postRouter.get('/:postId/:commentId/:replyId/like',checkPostExist,checkCommentExist,checkReplyExist,verifyToken(),likeReply);
postRouter.get('/:postId/:commentId/:replyId/dislike',checkPostExist,checkCommentExist,checkReplyExist,verifyToken(),dislikeReply);


postRouter.post('/',verifyToken(),postValidator,createPost);
postRouter.post('/:postId/comment',checkPostExist,verifyToken(),commentValidator,addComment);
postRouter.post('/:postId/:commentId/comment/reply',checkPostExist,checkCommentExist,
verifyToken(),replyValidator,replyToComment);

//reply to replies undercomment

postRouter.put('/:postId',checkPostExist,verifyToken(),checkPostAuth,postValidator,updatePost);
postRouter.put('/:postId/:commentId/comment',checkPostExist,
checkCommentExist,verifyToken(),checkCommentAuth,commentValidator,updateComment);

postRouter.delete('/:postId',checkPostExist,verifyToken(),checkPostAuth,deletePost);
postRouter.delete('/:postId/:commentId/comment',checkPostExist,
checkCommentExist,verifyToken(),checkCommentAuth,deleteComment);
postRouter.delete('/:postId/:commentId/:replyId/comment/reply',checkPostExist,
checkCommentExist,checkReplyExist,verifyToken(),checkReplyAuth,deleteReply);
export {postRouter}