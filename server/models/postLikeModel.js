import mongoose from 'mongoose';
const {Schema} = mongoose;

const postLikeSchema = new Schema(
    {
        user:{
            type:mongoose.ObjectId,
            ref:'user',
            index:true,
            required:true
        },
        post:
        {
            type:mongoose.ObjectId,
            ref:'post',
            required:true
        },
        like:
        {
            type:Boolean,
            default:true
        }

    }
)
export {postLikeSchema};