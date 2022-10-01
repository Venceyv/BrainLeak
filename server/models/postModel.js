import mongoose from 'mongoose';

const {Schema} = mongoose;

const postSchema = new Schema({
    title:{
        type: String,
        require:true
    },
    description:
    {
        type:String,
        require:false
    },
    publishDate:
    {
        type:Date,
        default:Date.now()
    },
    updateDate:
    {
        type:Date,
        default:Date.now()
    },
    tags:
    {
        type:[{
            type:String
        }],
        default:["cheese post"]
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
    //Number of comments
    commentCount:
    {
        type:Number,
        default:0
    },
    marks:
    {
        type:Number,
        default:0
    },
    views:
    {
        type:Number,
        default:0
    },
    author:
    {
        type:mongoose.ObjectId,ref:'user',
        required:true
    },
    edited:
    {
        type:Boolean,
        default:false
    },
    put:
    {
        type:Boolean,
        default:false
    }
})

export {postSchema};