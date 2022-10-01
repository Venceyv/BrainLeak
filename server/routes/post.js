import express, { Router } from "express";
import {createPost,findOne,findByTags,findAll,findBySearch,updatePost,deletePost} from '../controllers/posts.js';
import { addComment,deleteComment,updateComment } from "../controllers/comments.js";
import {verifyToken} from '../services/jwt.js';
import {postValidator} from '../middleware/validator/postValidator.js';
import {commentValidator} from '../middleware/validator/commentValidator.js'
const postRouter = express();

postRouter.get('/',findAll);
postRouter.get('/search',findBySearch);
postRouter.get('/tags',findByTags);
postRouter.get('/:postId',verifyToken(false),findOne);
postRouter.post('/',verifyToken(),postValidator,createPost);
postRouter.post('/:postId/comment',verifyToken(),commentValidator,addComment);
postRouter.put('/:postId',verifyToken(),postValidator,updatePost);
postRouter.put('/:postId/comment/:commentId',verifyToken(),commentValidator,updateComment);
postRouter.delete('/:postId',verifyToken(),deletePost);
postRouter.delete('/:postId/comment/:commentId',verifyToken(),deleteComment);
export {postRouter}