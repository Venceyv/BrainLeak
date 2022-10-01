import mongoose from "mongoose";
const {Schema} = mongoose;
const replySchema = new Schema({
    content:{
        type:String,
        required:true
    },
    createDate:
    {
        type:Date,
        default:Date.now()
    },
    relatedComment:
    {
        type:mongoose.ObjectId,ref:'comment',
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
    }

}
)
export {replySchema}