
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
  getFollower,
  getFollowing,
  logOut,
  getLikePosts,
  getDislikePosts,
  getSavedPosts,
  userTrending,
  getUserComments,
  getUserPosts,
  refreshToken,
  getNewComment,
  getNewPost,
  getNewLike,
  getNotification,
  getMyComments,
  getMyReplies,
  getMylikes,
  getMyMarks
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
userRouter.get("/auth-check/:userId", checkUserExist, verifyToken(), checkUserAuth, findOne);
userRouter.get("/comments/:userId", checkUserExist, verifyToken(false), getUserComments);
userRouter.get("/posts/:userId", checkUserExist, verifyToken(false), getUserPosts);
userRouter.get("/followerList/:userId", checkUserExist, verifyToken(false), getFollower);
userRouter.get("/followingList/:userId", checkUserExist, verifyToken(false), getFollowing);
userRouter.get("/likedPosts/:userId", checkUserExist, verifyToken(), checkUserAuth, getLikePosts);
userRouter.get("/dislikedPosts/:userId", checkUserExist, verifyToken(), checkUserAuth, getDislikePosts);
userRouter.get("/savedPosts/:userId", checkUserExist, verifyToken(), checkUserAuth, getSavedPosts);
userRouter.get("/refreshToken/:userId", checkUserExist, refreshToken);
userRouter.get("/newPosts/:userId",checkUserExist,verifyToken(),checkUserAuth,getNewPost);
userRouter.get("/newComments/:userId",checkUserExist,verifyToken(),checkUserAuth,getNewComment);
userRouter.get("/newLikes/:userId",checkUserExist,verifyToken(),checkUserAuth,getNewLike);
userRouter.get("/notification/:userId",checkUserExist,verifyToken(),checkUserAuth,getNotification);
userRouter.get("/myComments/:userId",checkUserExist,verifyToken(),checkUserAuth,getMyComments);
userRouter.get("/myReplies/:userId",checkUserExist,verifyToken(),checkUserAuth,getMyReplies);
userRouter.get("/mylikes/:userId",checkUserExist,verifyToken(),checkUserAuth,getMylikes);
userRouter.get("/mymarks/:userId",checkUserExist,verifyToken(),checkUserAuth,getMyMarks);

userRouter.put("/follow/:userId", checkUserExist, verifyToken(), followUser);
userRouter.put("/avatar/:userId", checkUserExist, verifyToken(), checkUserAuth, upload.single("avatar"), updateAvatar);
userRouter.put(
  "/backgroundCover/:userId",
  checkUserExist,
  verifyToken(),
  checkUserAuth,
  upload.single("backgroundCover"),
  updateBackgroundCover
);
userRouter.put("/:userId", checkUserExist, verifyToken(), checkUserAuth, userValidator, updateUser);

userRouter.post("/logout/:userId", checkUserExist, verifyToken(), checkUserAuth, logOut);

userRouter.delete("/:userId", checkUserExist, verifyToken(), checkUserAuth, deleteUser);
export { userRouter };
