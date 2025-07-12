import express from 'express';
import { createQuestion,allquestion,questionById,questionDelete,questionUpdate,likeandUnlike,getMyQuestion } from '../Controllers/question.controller.js';
import { Authenticate } from '../Middlewares/auth.user.js';
const router=express.Router();


router.post("/postquestion",Authenticate,createQuestion);

router.get("/allquestion",allquestion);

router.get("/questionById/:id",questionById);

router.delete("/deleteQuestion/:id",Authenticate,questionDelete);

router.put("/updateQuestion/:questionId",Authenticate,questionUpdate);

router.get("/questions/:userId",getMyQuestion);

router.patch("/questions/:id/like",Authenticate,likeandUnlike);


export default router;