import { Post, User } from "../models/index.js";
import json from "body-parser";
async function checkPostExist(req, res, next) {
  try {
    const post = await Post.findById(req.params.postId, { publishDate: 0, updateDate: 0, tags: 0 }).lean();
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
    if (!req.post.author.equals(req.user._id)) {
      res.status(401);
      throw "unauthorized";
    }
    return next();
  } catch (error) {
    res.json({ error: error });
  }
}
export { checkPostExist, checkPostAuth };
