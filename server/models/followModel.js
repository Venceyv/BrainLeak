import mongoose from "mongoose";
const { Schema } = mongoose;

const followSchema = new Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
    index: true,
    ref: "user",
  },
  followedUser: {
    type: mongoose.ObjectId,
    required: true,
    index: true,
    ref: "user",
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
});
export { followSchema };
