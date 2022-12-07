import { Reply } from "../models/index.js";
import mongoose from 'mongoose';
import jwt_decode from "jwt-decode";
import json from "body-parser";
async function checkReplyExist(req, res, next) {
  try {
    if(!mongoose.isValidObjectId(req.params.replyId)){
      res.status(404);
      throw "invalid params";
    }
    const reply = await Reply.findById(req.params.replyId).lean();
    if (!reply) {
      res.status(404);
      throw "Reply does not exist";
    }
    req.reply = reply;
    return next();
  } catch (error) {
    res.json({ error: error });
  }
}
async function checkReplyAuth(req, res, next) {
  try {
    let token = req.headers.authorization;
    token = token ? token.replace("Bearer ", "") : null;
    const decodedToken = jwt_decode(token);
    if (!req.reply.author.equals(decodedToken.userInfo.userId)) {
      res.status(401);
      throw "unauthorized";
    }
    return next();
  } catch (error) {
    res.json({ error: error });
  }
}
export { checkReplyExist, checkReplyAuth };
