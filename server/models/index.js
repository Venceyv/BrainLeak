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
postSchema.index({updateDate:-1});
postSchema.index({updateDate:1});
const Post = mongoose.model('post',postSchema);
commentSchema.index({likes:-1});
commentSchema.index({dislikes:-1});
const Comment = mongoose.model('comment',commentSchema);
const Reply = mongoose.model('reply',replySchema);
followSchema.index({user:1,followedUser:1})
const Follow = mongoose.model('follower',followSchema);
const Tags = mongoose.model('tags',tagsSchema)
likedPostSchema.index({user:1,post:1});
const LikedPost = mongoose.model('likedPost',likedPostSchema);
dislikedPostSchema.index({user:1,post:1});
const DislikedPost = mongoose.model('dislikedPost',dislikedPostSchema);
savedPostSchema.index({user:1,post:1});
const SavedPost = mongoose.model('savedPost',savedPostSchema);

export{User,Post,Comment,Reply,Follow,Tags,LikedPost,DislikedPost,SavedPost};