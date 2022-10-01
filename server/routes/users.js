import express from 'express';
import { findAll, deleteUser, findOne, updateUser, findBySearch, followUser, unfollowUser,updateAvatar,updateBackgroundCover, getFollwer,getFollwing } from '../controllers/users.js';
import {verifyToken} from '../services/jwt.js'
import {userValidator} from "../middleware/validator/userValidator.js"
import { upload } from '../configs/googleCloud.js';

const userRouter = express();

userRouter.get('/',verifyToken(false),findAll);
userRouter.get('/follow/:userId',verifyToken(),followUser);
userRouter.get('/unfollow/:userId',verifyToken(),unfollowUser);
userRouter.get('/search',verifyToken(false),findBySearch);
userRouter.get('/followerList/:userId',getFollwer);
userRouter.get('/followingList/:userId',getFollwing);
userRouter.get('/:userId',verifyToken(false),findOne);
userRouter.delete('/:userId',verifyToken(),deleteUser);
userRouter.put('/avatar/:userId',verifyToken(),upload.single('avatar'),updateAvatar);
userRouter.put('/backgroundCover/:userId',verifyToken(),upload.single('backgroundCover'),updateBackgroundCover);
userRouter.put('/:userId',verifyToken(),userValidator,updateUser);
export{userRouter};

