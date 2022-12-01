import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  avatar: {
    type: String,
    required: true, // google acount avatar
  },
  // user name
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    immutable: true,
    index: true,
  },
  introduction: {
    type: String,
    default: "cheese introduction",
  },
  backgroundCover: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "secret"],
    default: "secret",
  },
  birthDate: {
    type: Date,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
});
export { userSchema };
