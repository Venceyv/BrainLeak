import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  avatar: {
    type: String,
    default: null,
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
    default: 'cheese introduction',
  },
  backgroundCover: {
    type: String,
    default: 'https://storage.googleapis.com/brainleak/backgroundImg(default).png',
  },
  // A collection of all the other users id that the user is currently following
  // user liked history
  // following:
  // {
  //     type:Number,
  //     default:0
  // },
  // follower:
  // {
  //     type:Number,
  //     default:0
  // },
  // postCount:
  // {
  //     type:Number,
  //     default:0
  // },
  // commentCount:
  // {
  //     type:Number,
  //     default:0
  // },
  // upVoteGet:
  // {
  //     type:Number,
  //     default:0,
  // },
});
export { userSchema };
