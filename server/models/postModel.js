import mongoose from "mongoose";

const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: false,
  },
  cover:{
    type:String,
    default:null,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  updateDate: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [
      {
        type: String,
      },
    ],
    default: ["cheese post"],
  },
  author: {
    type: mongoose.ObjectId,
    ref: "user",
    index: true,
    required: true,
    immutable: true,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  pinnedComment:{
    type:mongoose.ObjectId,
    ref:"comment",
    default: null,
  },
  notify: {
    type: Boolean,
    default: false,
  },
});

export { postSchema };
