import mongoose from "mongoose";
const { Schema } = mongoose;

const replyLikeSchema = new Schema({
  user: {
    type: mongoose.ObjectId,
    ref: "user",
    index: true,
    required: true,
  },
  reply: {
    type: mongoose.ObjectId,
    ref: "reply",
    required: true,
  },
  like: {
    type: Boolean,
    default: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
});
export { replyLikeSchema };
