import mongoose from 'mongoose';
import {commentSchema} from './commentModel.js';
import {postSchema} from './postModel.js';
import {userSchema}  from './userModel.js';
import { replySchema } from './replyModel.js';
import {followSchema} from './followModel.js';
import { tagsSchema } from './tagsModel.js';
import { likedPostSchema } from './likedPostModel.js';
import { dislikedPostSchema } from './dislikedPostModel.js';
import { savedPostSchema } from './savedPostModel.js';

const User = mongoose.model('user',userSchema);
const Post = mongoose.model('post',postSchema);
const Comment = mongoose.model('comment',commentSchema);
const Reply = mongoose.model('reply',replySchema);
const Follow = mongoose.model('follower',followSchema);
const Tags = mongoose.model('tags',tagsSchema)
const LikedPost = mongoose.model('likedPost',likedPostSchema);
const DislikedPost = mongoose.model('dislikedPost',dislikedPostSchema);
const SavedPost = mongoose.model('savedPost',savedPostSchema);
export{User,Post,Comment,Reply,Follow,Tags,LikedPost,DislikedPost,SavedPost};