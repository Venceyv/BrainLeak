import { User } from "../models/index.js";
import jwt_decode from "jwt-decode";
import json from "body-parser";
async function checkUserExist(req, res, next) {
  try {
    const user = await User.findById(req.params.userId, { isDelete: 1 }).lean();
    if (!user || user.isDelete) {
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
