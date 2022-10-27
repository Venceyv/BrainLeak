import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
  content: {
    type: String,
    require: true,
  },
  author: {
    type: mongoose.ObjectId,
    ref: "user",
    require: true,
  },
  createTime: {
    type: Date,
    default: Date.now(),
  },
  updateTime: {
    type: Date,
    default: Date.now(),
  },
  relatedPost: {
    type: mongoose.ObjectId,
    ref: "post",
    index: true,
    required: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
});

export { commentSchema };
