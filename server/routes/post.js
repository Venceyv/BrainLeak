import { Router } from "express";
import {createPost,findOne,findByTags,findAll,findBySearch,updatePost,deletePost} from '../controllers/posts.js';
import { addComment,deleteComment,updateComment } from "../controllers/comments.js";
import {verifyToken} from '../services/jwt.js';
import {postValidator} from '../middleware/validator/postValidator.js';
import {commentValidator} from '../middleware/validator/commentValidator.js'
import { replyValidator } from "../middleware/validator/replyValidator.js";
import { replyToComment, deleteReply } from "../controllers/replies.js";

const postRouter = Router();

postRouter.get('/',verifyToken(false),findAll);
postRouter.get('/search',verifyToken(false),findBySearch);
postRouter.get('/tags',verifyToken(false),findByTags);
postRouter.get('/:postId',verifyToken(false),findOne);


postRouter.post('/',verifyToken(),postValidator,createPost);
postRouter.post('/:postId/comment',verifyToken(),commentValidator,addComment);
postRouter.post('/:posTId/comment/:commentId/reply',verifyToken(),replyValidator,replyToComment);

//reply to replies undercomment

postRouter.put('/:postId',verifyToken(),postValidator,updatePost);
postRouter.put('/:postId/comment/:commentId',verifyToken(),commentValidator,updateComment);

postRouter.delete('/:postId',verifyToken(),deletePost);
postRouter.delete('/:postId/comment/:commentId',verifyToken(),deleteComment);
postRouter.delete('/:posTId/comment/:commentId/reply/:replyId',verifyToken(),replyValidator,deleteReply);
export {postRouter}