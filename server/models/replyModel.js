import mongoose from "mongoose";
const {Schema} = mongoose;
const replySchema = new Schema({
    content:{
        type:String,
        required:true
    },
    createTime:
    {
        type:Date,
        default:Date.now()
    },
    relatedComment:
    {
        type:mongoose.ObjectId,
        ref:'comment',
        index:true,
        required:true
    },
    relatedPost:
    {
        type:mongoose.ObjectId,
        ref:'post',
        index:true,
        required:true
    },
    mentionedUser:
    {
        type:mongoose.ObjectId,ref:'user',
        required:false
    },
    author:
    {
        type:mongoose.ObjectId,ref:'user',
        required:true
    },
    likes:
    {
        type:Number,
        default:0
    },
    dislikes:
    {
        type:Number,
        default:0
    },

}
)
export {replySchema}