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
  publishDate: {
    type: Date,
    default: Date.now(),
  },
  updateDate: {
    type: Date,
    default: Date.now(),
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
  },
  edited: {
    type: Boolean,
    default: false,
  },
  put: {
    type: Boolean,
    default: false,
  },
});

export { postSchema };
