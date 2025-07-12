import mongoose from "mongoose";

const questionSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        required:false
    },
    askedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    answers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Answer'
    }],
    likesCount:{
        type:Number,
        default:0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    viewsCount:{
        type:Number,
        default:0
    }
},{timestamps:true}
);


export const Question=mongoose.model("Question",questionSchema);