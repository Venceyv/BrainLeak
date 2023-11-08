import { Comment } from "../models/index.js";
import mongoose from 'mongoose';
import jwt_decode from "jwt-decode";
import json from "body-parser";
async function checkCommentExist(req, res, next) {
  try {
    if(!mongoose.isValidObjectId(req.params.commentId)){
      res.status(404);
      throw "invalid params";
    }
    const comment = await Comment.findById(req.params.commentId).lean();
    if (!comment) {
      res.status(404);
      throw "Comment does not exist";
    }
    req.comment = comment;
    return next();
  } catch (error) {
    res.json({ error: error });
  }
}
async function checkCommentAuth(req, res, next) {
  try {
    let token = req.headers.authorization;
    token = token ? token.replace("Bearer ", "") : null;
    const decodedToken = jwt_decode(token);
    if (!req.comment.author.equals(decodedToken.userInfo.userId)) {
      res.status(401);
      throw "unauthorized";
    }
    return next();
  } catch (error) {
    res.json({ error: error });
  }
}
export { checkCommentExist, checkCommentAuth };
