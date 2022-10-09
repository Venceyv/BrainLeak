import { Router } from 'express';
import { findAll, deleteUser, findOne, updateUser, findBySearch, followUser, unfollowUser,updateAvatar,updateBackgroundCover, getFollwer,getFollwing, logOut } from '../controllers/users.js';
import {verifyToken} from '../services/jwt.js'
import {userValidator} from "../middleware/validator/userValidator.js"
import { upload } from '../configs/googleCloud.js';
const userRouter = Router();

userRouter.get('/',verifyToken(false),findAll);
userRouter.get('/follow/:userId',verifyToken(),followUser);
userRouter.get('/unfollow/:userId',verifyToken(),unfollowUser);
userRouter.get('/search',verifyToken(false),findBySearch);
userRouter.get('/followerList/:userId',verifyToken(false),getFollwer);
userRouter.get('/followingList/:userId',verifyToken(false),getFollwing);
userRouter.get('/:userId',verifyToken(false),findOne);
userRouter.delete('/:userId',verifyToken(),deleteUser);
userRouter.put('/avatar/:userId',verifyToken(),upload.single('avatar'),updateAvatar);
userRouter.put('/backgroundCover/:userId',verifyToken(),upload.single('backgroundCover'),updateBackgroundCover);
userRouter.put('/:userId',verifyToken(),userValidator,updateUser);
userRouter.post('/logout/:userId',verifyToken(),logOut);
export{userRouter};

