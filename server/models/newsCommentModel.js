import mongoose from "mongoose";
const { Schema } = mongoose;

const newsCommentSchema = new Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
    index: true,
    ref: "user",
  },
  action: {
    type: String,
    required: true,
  },
  comment:{
    type: mongoose.ObjectId,
    required: true,
    ref: "comment",
  },
  relatedPost:{
    type:mongoose.ObjectId,
    required:true,
    ref:"Post",
  },
  publishDate:{
    type:Date,
    default:Date.now(),
  }
});
export { newsCommentSchema };
