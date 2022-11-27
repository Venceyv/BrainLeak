import mongoose from "mongoose";

const { Schema } = mongoose;
const date = new Date();
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
  publishDate: {
    type: Date,
    default: Date.now(),
  },
  updateDate: {
    type: Date,
    default: Date.now(),
  },
  relatedPost: {
    type: mongoose.ObjectId,
    ref: "post",
    index: true,
    required: true,
  },
  postAuthor:{
    type: mongoose.ObjectId,
    ref: "user",
    index: true,
    required: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
});

export { commentSchema };
