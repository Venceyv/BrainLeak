import { Comment } from "../models/index.js";
import json from "body-parser";
async function checkCommentExist(req, res, next) {
  try {
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
    if (!req.comment.author.equals(req.user._id)) {
      res.status(401);
      throw "unauthorized";
    }
    return next();
  } catch (error) {
    res.json({ error: error });
  }
}
export { checkCommentExist, checkCommentAuth };
