import mongoose from 'mongoose';
const {Schema} = mongoose;

const dislikedPostSchema = new Schema(
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
        }
    }
)
export {dislikedPostSchema};