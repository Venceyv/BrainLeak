import mongoose from "mongoose";
const { Schema } = mongoose;

const commentLikeSchema = new Schema({
  user: {
    type: mongoose.ObjectId,
    ref: "user",
    index: true,
    required: true,
  },
  comment: {
    type: mongoose.ObjectId,
    ref: "comment",
    required: true,
  },
  commentAuthor:{
    type: mongoose.ObjectId,
    ref: "user",
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
export { commentLikeSchema };
