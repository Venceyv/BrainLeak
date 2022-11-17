import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  avatar: {
    type: String,
    default: null,// google acount avatar
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
    default: "https://storage.googleapis.com/brainleak/backgroundImg(default).png",
  },
  gender:{
    type:String,
    enum:['male','female','secret'],
    default:'secret'
  },
  birthDate:{
    type:Date,
  },
  isDelete: {
    type: Boolean,
    default: false,
  }
});
export { userSchema };
