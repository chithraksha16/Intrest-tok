import express from 'express';
import { createAnswer,deleteAnswer,likeAndUnlikeAnswer } from '../Controllers/answer.controller.js';
import { Authenticate } from '../Middlewares/auth.user.js';
const router=express.Router();


router.post("/questions/:questionId/answers",Authenticate,createAnswer);

router.delete('/deleteAnswer/:id',Authenticate,deleteAnswer)

router.patch('/answer/:id/like',Authenticate,likeAndUnlikeAnswer)

export default router