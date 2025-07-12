import { Comment } from "../Models/comment.model.js";
import { Answer } from "../Models/answer.model.js";



export const createComment=async(req,res)=>{
    try{
        const {content}=req.body;
        const {answerId}=req.params;

        if(!content) return res.status(400).json({message:"Contetnt is required"});
        
        const answer=await Answer.findById(answerId);
        if(!answer) return res.status(400).json({message:"Answer not Found"});

        const comment = await Comment.create({
            content,
            commentedBy:req.user._id,
            answer:answerId
        });

        answer.comments.push(comment._id)
        await answer.save();

        await comment.populate('commentedBy','name');
        

        res.status(201).json({message:"Commented added",comment})
    }
    catch (error) {
    res.status(500).json({ message: error.message });
}
}

export const deleteComment=async(req,res)=>{
    try{
        const commentId=req.params.id;

        const comment= await Comment.findById(commentId);
        if(!comment) return res.satus(400).json({message:"Comment not found"});

        if(comment.commentedBy.toString() !== req.user._id.toString()){
            return res.status(400).json({message:"You are not allowed to delete this comment"})
        }

        await comment.deleteOne();

        await Answer.findByIdAndUpdate(comment.answer,{$pull:{comments:commentId}})

        res.status(200).json({message:"commennt deleted sucessfully"});
    }
    catch (error) {
    res.status(500).json({ message: error.message });
}

}


// export const likeAndUnlikeComment = async (req, res) => {
//   try {
//     const commentId = req.params.id;
//     const userId = req.user.id; // Must be authenticated
//     const action = req.body.action;

//     const comment = await Comment.findById(commentId);
//     if (!comment) return res.status(404).json({ message: "Comment not found" });

//     const hasLiked = comment.likedBy.includes(userId);

//     if (action === 'like') {
//       if (hasLiked) {
//         return res.status(400).json({ message: "You already liked this comment." });
//       }
//       comment.likesCount += 1;
//       comment.likedBy.push(userId);
//     } else if (action === 'unlike') {
//       if (!hasLiked) {
//         return res.status(400).json({ message: "You haven't liked this comment yet." });
//       }
//       comment.likesCount = Math.max(0, comment.likesCount - 1);
//       comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
//     } else {
//       return res.status(400).json({ message: "Invalid action. Use 'like' or 'unlike'." });
//     }

//     await comment.save();

//     res.json({
//       message: `Comment successfully ${action}d.`,
//       likesCount: comment.likesCount,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const likeAndUnlikeComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id; // Auth middleware must set this
    const action = req.body.action; // Should be either "like" or "unlike"

    // 1. Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // 2. Check if user already liked it
    const hasLiked = comment.likedBy.some(
      (id) => id.toString() === userId.toString()
    );

    // 3. Apply the like or unlike logic
    if (action === "like") {
      if (hasLiked) {
        return res.status(400).json({ message: "You already liked this comment." });
      }
      comment.likesCount += 1;
      comment.likedBy.push(userId);
    } else if (action === "unlike") {
      if (!hasLiked) {
        return res.status(400).json({ message: "You haven't liked this comment yet." });
      }
      comment.likesCount = Math.max(0, comment.likesCount - 1);
      comment.likedBy = comment.likedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'like' or 'unlike'." });
    }

    // 4. Save and respond
    await comment.save();

    res.status(200).json({
      message: `Comment successfully ${action}d.`,
      likesCount: comment.likesCount,
      likedBy: comment.likedBy,
    });

  } catch (error) {
    console.error("Like/unlike comment error:", error);
    res.status(500).json({ message: error.message });
  }
};