import express from 'express';
import { registerUser,loginUser } from '../Controllers/user.controller.js';

const router=express.Router();

//user registration routes
router.post('/register',registerUser);
router.post("/login",loginUser)




export default router;