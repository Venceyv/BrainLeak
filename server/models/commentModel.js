import mongoose from 'mongoose';

const {Schema} = mongoose;

const commentSchema = new Schema({
    content:{
        type:String,
        require:true
    },
    author:{
        type:mongoose.ObjectId,
        ref:'user',
        require:true
    },
    createTime:
    {
        type:Date,
        default:Date.now()
    },
    updateTime:
    {
        type:Date,
        default:Date.now()
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
    repliesCount:
    {
        type:Number,
        default:0
    },
    relatedPost:
    {
        type:mongoose.ObjectId,
        ref:'post',
        index:true,
        required:true
    },
    edited:
    {
        type:Boolean,
        default:false
    }
})

export {commentSchema};