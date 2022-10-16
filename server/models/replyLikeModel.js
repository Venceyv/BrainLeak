import mongoose from 'mongoose';
const {Schema} = mongoose;

const replyLikeSchema = new Schema(
    {
        user:{
            type:mongoose.ObjectId,
            ref:'user',
            index:true,
            required:true
        },
        reply:
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
export {replyLikeSchema};