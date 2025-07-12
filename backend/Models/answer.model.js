import mongoose from "mongoose";


const answerSchema= new mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:String
    },
    answeredBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    question:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question',
        required:true
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    likesCount:{
        type:Number,
        default:0
    },
    likedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    isEdited:{
        type:Boolean,
        default:false
    }
},{timestamps:true}
)

export const Answer=mongoose.model("Answer",answerSchema);