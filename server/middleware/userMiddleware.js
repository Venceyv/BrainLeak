import { User } from "../models/index.js";
import mongoose from 'mongoose';
import jwt_decode from "jwt-decode";
import json from "body-parser";
async function checkUserExist(req, res, next) {
  try {
    if(!mongoose.isValidObjectId(req.params.userId)){
      res.status(401);
      throw "invalid params";
    }
    const user = await User.find({_id:req.params.userId,isDelete:false}).lean();
    if (user.length===0) {
      res.status(404);
      throw "User does not exist";
    }
    req.targetUser = user;
    return next();
  } catch (error) {
    res.json({ error: error });
  }
}
function checkUserAuth(req, res, next) {
  try {
    let token = req.headers.authorization;
    token = token ? token.replace("Bearer ", "") : null;
    const decodedToken = jwt_decode(token);
    if (!req.targetUser._id.equals(decodedToken.userInfo.userId)) {
      res.status(401);
      throw "unauthorized";
    }
    return next();
  } catch (error) {
    res.json({ error: error });
  }
}
export { checkUserExist, checkUserAuth };
