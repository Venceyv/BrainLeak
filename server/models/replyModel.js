import mongoose from "mongoose";
const { Schema } = mongoose;
const replySchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  relatedComment: {
    type: mongoose.ObjectId,
    ref: "comment",
    index: true,
    required: true,
  },
  relatedPost: {
    type: mongoose.ObjectId,
    ref: "post",
    index: true,
    required: true,
  },
  mentionedUser: {
    type: mongoose.ObjectId,
    ref: "user",
    required: false,
    immutable: true,
  },
  author: {
    type: mongoose.ObjectId,
    ref: "user",
    required: true,
  },
});
export { replySchema };
