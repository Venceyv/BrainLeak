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
    ref: "post",
    required: true,
  },
  like: {
    type: Boolean,
    default: true,
  },
});
export { commentLikeSchema };
