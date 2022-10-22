import mongoose from "mongoose";
import { commentSchema } from "./commentModel.js";
import { postSchema } from "./postModel.js";
import { userSchema } from "./userModel.js";
import { replySchema } from "./replyModel.js";
import { followSchema } from "./followModel.js";
import { tagsSchema } from "./tagsModel.js";
import { postLikeSchema } from "./postLikeModel.js";
import { savedPostSchema } from "./savedPostModel.js";
import { commentLikeSchema } from "./commentLikeModel.js";
import { replyLikeSchema } from "./replyLikeModel.js";

const User = mongoose.model("user", userSchema);
postSchema.index({ updateDate: -1 });
postSchema.index({ updateDate: 1 });
const Post = mongoose.model("post", postSchema);

const Comment = mongoose.model("comment", commentSchema);
const Reply = mongoose.model("reply", replySchema);
followSchema.index({ user: 1, followedUser: 1 });
const Follow = mongoose.model("follower", followSchema);
const Tags = mongoose.model("tags", tagsSchema);
postLikeSchema.index({ user: 1, post: 1 });
postLikeSchema.index({ user: 1, like: 1 });
const PostLike = mongoose.model("postlike", postLikeSchema);
commentLikeSchema.index({ user: 1, comment: 1 });
const CommentLike = mongoose.model("commentlike", commentLikeSchema);
replyLikeSchema.index({ user: 1, reply: 1 });
const ReplyLike = mongoose.model("replylike", replyLikeSchema);
savedPostSchema.index({ user: 1, post: 1 });
const SavedPost = mongoose.model("savedPost", savedPostSchema);

export { User, Post, Comment, Reply, Follow, Tags, PostLike, SavedPost, CommentLike, ReplyLike };
