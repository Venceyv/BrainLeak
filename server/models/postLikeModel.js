import mongoose from "mongoose";
const { Schema } = mongoose;

const postLikeSchema = new Schema({
  user: {
    type: mongoose.ObjectId,
    ref: "user",
    index: true,
    required: true,
  },
  post: {
    type: mongoose.ObjectId,
    ref: "post",
    required: true,
  },
  postAuthor:{
    type: mongoose.ObjectId,
    ref: "user",
    index: true,
    required: true,
  },
  like: {
    type: Boolean,
    default: true,
  },
  publishDate: {
    type: Date,
    default: Date.now(),
  },
});
export { postLikeSchema };
