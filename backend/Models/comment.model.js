import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    content:{
        type:String,
        trim:true,
        required:true
    },
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    answer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Answer',
        required:true
    },
    likesCount:{
        type:Number,
        default:0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
},{timestamps:true})

 export const Comment=mongoose.model("Comment",commentSchema);