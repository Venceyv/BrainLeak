import mongoose from "mongoose";
const { Schema } = mongoose;

const newsPostSchema = new Schema({
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
  post:{
    type: mongoose.ObjectId,
    required: true,
    ref: "post",
  },
  publishDate:{
    type:Date,
    default:Date.now,
  }
});
export { newsPostSchema };
