import { Router } from "express";
import {
  findAll,
  deleteUser,
  findOne,
  updateUser,
  findBySearch,
  followUser,
  updateAvatar,
  updateBackgroundCover,
  getFollwer,
  getFollwing,
  logOut,
  getLikePosts,
  getDislikePosts,
  getSavedPosts,
  userTrending,
  getUserComments,
  getUserPosts,
  refreshToken,
} from "../controllers/users.js";
import { verifyToken } from "../services/jwt.js";
import { userValidator } from "../middleware/validator/userValidator.js";
import { checkUserExist, checkUserAuth } from "../middleware/userMiddleware.js";
import { upload } from "../configs/googleCloud.js";
const userRouter = Router();

userRouter.get("/", verifyToken(false), findAll);
userRouter.get("/trending", verifyToken(false), userTrending);
userRouter.get("/search", verifyToken(false), findBySearch);
userRouter.get("/:userId", checkUserExist, verifyToken(false), findOne);
userRouter.get("/:userId/auth-check", checkUserExist, verifyToken(), checkUserAuth, findOne);
userRouter.get("/:userId/comments", checkUserExist, verifyToken(false), getUserComments);
userRouter.get("/:userId/posts", checkUserExist, verifyToken(false), getUserPosts);
userRouter.get("/:userId/followerList", checkUserExist, verifyToken(false), getFollwer);
userRouter.get("/:userId/followingList", checkUserExist, verifyToken(false), getFollwing);
userRouter.get("/:userId/likedPosts", checkUserExist, verifyToken(), checkUserAuth, getLikePosts);
userRouter.get("/:userId/dislikedPosts", checkUserExist, verifyToken(), checkUserAuth, getDislikePosts);
userRouter.get("/:userId/savedPosts", checkUserExist, verifyToken(), checkUserAuth, getSavedPosts);
userRouter.get("/:userId/refreshToken", checkUserExist, refreshToken);

userRouter.put("/:userId/follow", checkUserExist, verifyToken(), followUser);
userRouter.put("/:userId/avatar", checkUserExist, verifyToken(), checkUserAuth, upload.single("avatar"), updateAvatar);
userRouter.put(
  "/:userId/backgroundCover",
  checkUserExist,
  verifyToken(),
  checkUserAuth,
  upload.single("backgroundCover"),
  updateBackgroundCover
);
userRouter.put("/:userId", checkUserExist, verifyToken(), checkUserAuth, userValidator, updateUser);

userRouter.post("/:userId/logout", checkUserExist, verifyToken(), checkUserAuth, logOut);

userRouter.delete("/:userId", checkUserExist, verifyToken(), checkUserAuth, deleteUser);
export { userRouter };
