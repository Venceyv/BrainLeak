import { Router } from 'express';
import { findAll, deleteUser, findOne, updateUser, findBySearch, 
    followUser,updateAvatar,updateBackgroundCover,
     getFollwer,getFollwing, logOut, getLikePosts, getDislikePosts, 
     getSavedPosts, userTrending, getUserComments, getUserPosts } from '../controllers/users.js';
import {verifyToken} from '../services/jwt.js'
import {userValidator} from "../middleware/validator/userValidator.js"
import { checkUserExist,checkUserAuth } from '../middleware/userMiddleware.js';
import { upload } from '../configs/googleCloud.js';
const userRouter = Router();

userRouter.get('/',verifyToken(false),findAll);
userRouter.get('/comments/:userId',verifyToken(false),getUserComments);
userRouter.get('/posts/:userId',verifyToken(false),getUserPosts);
userRouter.get('/trending',verifyToken(false),userTrending);
userRouter.get('/search',verifyToken(false),findBySearch);
userRouter.get('/followerList/:userId',checkUserExist,verifyToken(false),getFollwer);
userRouter.get('/followingList/:userId',checkUserExist,verifyToken(false),getFollwing);
userRouter.get('/:userId',checkUserExist,verifyToken(false),findOne);
userRouter.get('/likePosts/:userId',checkUserExist,verifyToken(),checkUserAuth,getLikePosts);
userRouter.get('/dislikePosts/:userId',checkUserExist,verifyToken(),checkUserAuth,getDislikePosts);
userRouter.get('/savedPosts/:userId',checkUserExist,verifyToken(),checkUserAuth,getSavedPosts);


userRouter.put('/follow/:userId',checkUserExist,verifyToken(),followUser);
userRouter.put('/avatar/:userId',checkUserExist,verifyToken(),checkUserAuth,upload.single('avatar'),updateAvatar);
userRouter.put('/backgroundCover/:userId',checkUserExist,verifyToken(),checkUserAuth,upload.single('backgroundCover'),updateBackgroundCover);
userRouter.put('/:userId',checkUserExist,verifyToken(),checkUserAuth,userValidator,updateUser);

userRouter.post('/logout/:userId',checkUserExist,verifyToken(),checkUserAuth,logOut);

userRouter.delete('/:userId',checkUserExist,verifyToken(),checkUserAuth,deleteUser);
export{userRouter};

