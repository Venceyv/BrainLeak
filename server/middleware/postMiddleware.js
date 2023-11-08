import { Post } from "../models/index.js";
import mongoose from 'mongoose';
import jwt_decode from "jwt-decode";
import json from "body-parser";
async function checkPostExist(req, res, next) {
  try {
    if(!mongoose.isValidObjectId(req.params.postId)){
      res.status(404);
      throw "invalid params";
    }
    const post = await Post.findById(req.params.postId,{cover:0}).lean();
    if (!post) {
      res.status(404);
      throw "Post does not exist";
    }
    req.post = post;
    return next();
  } catch (error) {
    res.json({ error: error });
  }
}
async function checkPostAuth(req, res, next) {
  try {
    let token = req.headers.authorization;
    token = token ? token.replace("Bearer ", "") : null;
    const decodedToken = jwt_decode(token);
    if (!req.post.author.equals(decodedToken.userInfo.userId)) {
      res.status(401);
      throw "unauthorized";
    }
    return next();
  } catch (error) {
    res.json({ error: error });
  }
}
export { checkPostExist, checkPostAuth };
