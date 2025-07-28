import { Question } from "../Models/question.model.js";

export const createQuestion=async(req,res)=>{
    const {title,description,image}=req.body
    try{
        const question =await Question.create({
            title,
            description,
            image,
            askedBy:req.user._id,
            answers:[]
        });

        await question.populate('answers','name');

        res.status(201).json({message:"Question posted",question})
    }
    catch (error) {
    res.status(500).json({ message: error.message });
}
}

export const allquestion = async (req, res) => {
try {
    const questions = await Question.find()
    .populate({
        path: 'answers',
        populate: [
          {
            path: 'answeredBy',
            select: 'name'
          },
          {
            path: 'comments',
            select: 'content commentedBy createdAt',
            populate: {
              path: 'commentedBy',
              select: 'name'
            }
          }
        ]
      })
      .populate('askedBy', 'name') // Populate the user who asked the question
      .sort({ createdAt: -1 });
    

    res.status(200).json({ questions }); 
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

export const questionById =async(req,res)=>{
    try{
        const question=await Question.findById(req.params.id)
        .populate({
        path: 'answers',
        populate: {
        path: 'answeredBy',
        select: 'name' 
        }
    })
      .populate('askedBy', 'name') // Populate the user who asked the question
      .sort({ createdAt: -1 });

      await question.save();
            res.status(200).json({question})
    }
    catch (error) {
    res.status(500).json({ message: error.message });
}
}

export const questionDelete=async(req,res)=>{
    try{
        const question=await Question.findById(req.params.id)
        if(!question) return res.status(400).json({message:"Question not found"})

        if(question.askedBy.toString() !== req.user._id.toString()){
            return res.status(400).json({message:"You are not allowed to delete this question"})
        }
        await question.deleteOne();
        res.status(200).json({message:"Question Deleted"});
    }
    catch (error) {
    res.status(500).json({ message: error.message });
}
}

export const questionUpdate=async(req,res)=>{
    try{
    const {questionId}=req.params
    const question=await Question.findById(questionId)
    if(!question) return res.status(400).json({message:"Question not found"});


    if(question.askedBy.toString() !== req.user._id.toString()){
        return res.status(400).json({message:"You are not allowed to Upadate this question"})
    }

    question.set(req.body);
    const updatedques= await question.save();


        res.status(200).json({message:"Question updated",updatedques})
    }
    catch (error) {
    res.status(500).json({ message: error.message });
}
}


export const getMyQuestion=async(req,res)=>{
try{
    const {userId}=req.params;
    const questions= await Question.find({askedBy:userId}).sort({createdAt:-1})
    .populate({
        path: 'answers',
        populate: [
          {
            path: 'answeredBy',
            select: 'name'
          },
          {
            path: 'comments',
            select: 'content commentedBy createdAt ',
            populate: {
              path: 'commentedBy',
              select: 'name'
            }
          }
        ]
      })
      .populate('askedBy', 'name') // Populate the user who asked the question
      .sort({ createdAt: -1 });
    res.status(200).json({questions})
}
catch(error){
    res.status(500).json({message:"Error fecthing user's question"})
}
}




export const likeandUnlike = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user._id;
    const { action } = req.body;

    if (typeof action !== 'string') {
      return res.status(400).json({ message: "Invalid action format" });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const hasLiked = question.likedBy.some(id => id.toString() === userId.toString());

    if (action === 'like') {
      if (hasLiked) {
        return res.status(400).json({ message: "You have already liked this question." });
      }
      question.likesCount++;
      question.likedBy.push(userId);
    } else if (action === 'unlike') {
      if (!hasLiked) {
        return res.status(400).json({ message: "You haven't liked this question yet." });
      }
      question.likesCount = Math.max(0, question.likesCount - 1);
      question.likedBy = question.likedBy.filter(id => id.toString() !== userId.toString());
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'like' or 'unlike'." });
    }

    await question.save();

    res.status(200).json({
      message: `Question successfully ${action}d.`,
      likesCount: question.likesCount,
      likedBy: question.likedBy
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};