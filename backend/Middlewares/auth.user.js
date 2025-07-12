import jwt from 'jsonwebtoken';
import { User } from '../Models/user.model.js';


export const Authenticate=async(req,res,next)=>{
    try{
    const authHeader=req.headers["authorization"];

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({message:"Login first or Invalid token"})
    }

    const token=authHeader.split(" ")[1];
    const decode=jwt.verify(token,process.env.SECRET_KEY);

    const user= await User.findById(decode.userId);
    if(!user) return res.status(401).json({message:"User does not exists"});

    req.user=user;
    next()
    }
    catch(error){
        res.status(401).json({message:error.message});
    }

}