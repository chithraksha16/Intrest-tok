import { Answer } from "../Models/answer.model.js";
import { Question } from "../Models/question.model.js";



export const createAnswer=async(req,res)=>{
    try{
        const {content,image}=req.body;
        const {questionId}=req.params

        if(!content) return res.status(400).json({messsage:"Content is rquired"});

        const question=await Question.findById(questionId)
        if(!question) return res.status(401).json({message:"Question not found"})
        
        const answer=await Answer.create({
            content,
            image,
            answeredBy:req.user._id,
            question: questionId,
            comments:[]
        });

        //push answerid to question and saved in question
        question.answers.push(answer._id)
        await question.save();

        //populate for response
        await answer.populate([
            { path: 'answeredBy', select: 'name' },
            { path: 'question', select: 'title' },
                {
                    path: 'comments',
                    select: 'content commentedBy createdAt',
                    populate: {
                                path: 'commentedBy',
                                select: 'name',
                            },
                },
            ]);
        

        res.status(201).json({message:"Answer posted",answer});
    }
    catch (err) {
    console.error('Error creating answer:', err);
    res.status(500).json({ error: 'Internal server error.' });
}
}

export const deleteAnswer=async(req,res)=>{
    try{
        const answerId=req.params.id;
        const answer= await Answer.findById(answerId);
        if(!answer) return res.status(400).json({message:"Answer not found"});

        if(answer.answeredBy.toString() !== req.user._id.toString()){
            return res.status.json({message:"You are not allowed to delete this answer"})
        }

        await answer.deleteOne();

        await Question.findByIdAndUpdate(answer.question,{$pull:{answers:answerId}})

        res.status(200).json({message:"Answer Deleted Sucessfully"})
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}


// export const likeAndUnlikeAnswer = async (req, res) => {
//   try {
//     const answerId = req.params.id;
//     const userId = req.user._id; // Make sure user is authenticated
//     const action = req.body.action;

//     const answer = await Answer.findById(answerId);
//     if (!answer) return res.status(404).json({ message: "Answer not found" });

//     const hasLiked = answer.likedBy.includes(userId);

//     if (action === 'like') {
//       if (hasLiked) {
//         return res.status(400).json({ message: "You already liked this answer." });
//       }
//       answer.likesCount += 1;
//       answer.likedBy.push(userId);
//     } else if (action === 'unlike') {
//       if (!hasLiked) {
//         return res.status(400).json({ message: "You haven't liked this answer yet." });
//       }
//       answer.likesCount = Math.max(0, answer.likesCount - 1);
//       answer.likedBy = answer.likedBy.filter(id => id.toString() !== userId);
//     } else {
//       return res.status(400).json({ message: "Invalid action. Use 'like' or 'unlike'." });
//     }

//     await answer.save();

//     res.json({
//       message: `Answer successfully ${action}d.`,
//       likesCount: answer.likesCount,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const likeAndUnlikeAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const userId = req.user._id; // Assumes you have an auth middleware
    const action = req.body.action; // Expected values: "like" or "unlike"

    // 1. Fetch the answer
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // 2. Check if the user has already liked it
    const hasLiked = answer.likedBy.some(
      (id) => id.toString() === userId.toString()
    );

    // 3. Perform the like or unlike action
    if (action === "like") {
      if (hasLiked) {
        return res.status(400).json({ message: "You already liked this answer." });
      }
      answer.likesCount += 1;
      answer.likedBy.push(userId);
    } else if (action === "unlike") {
      if (!hasLiked) {
        return res.status(400).json({ message: "You haven't liked this answer yet." });
      }
      answer.likesCount = Math.max(0, answer.likesCount - 1);
      answer.likedBy = answer.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'like' or 'unlike'." });
    }

    // 4. Save and respond
    await answer.save();

    res.status(200).json({
      message: `Answer successfully ${action}d.`,
      likesCount: answer.likesCount,
      likedBy: answer.likedBy,
    });
  } catch (error) {
    console.error("Like/unlike answer error:", error);
    res.status(500).json({ message: error.message });
  }
};