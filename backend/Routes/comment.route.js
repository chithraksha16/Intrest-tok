import express from 'express';
import { createComment,deleteComment,likeAndUnlikeComment } from '../Controllers/comment.controller.js';
import { Authenticate } from '../Middlewares/auth.user.js';
const router=express.Router();


router.post("/comment/:answerId",Authenticate,createComment);

router.delete("/comment/:id/delete",Authenticate,deleteComment)

router.patch("/comment/:id/like",Authenticate,likeAndUnlikeComment)

export default router;