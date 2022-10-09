import mongoose from 'mongoose';
const {Schema} = mongoose;

const followSchema = new Schema(
    {
        user:{
            type: mongoose.ObjectId,
            required:true,
            index:true,
            ref:'user'
        },
        followedUser:{
            type:mongoose.ObjectId,
            required:true,
            index:true,
            ref:'user'
        }
    }
)
export {followSchema}