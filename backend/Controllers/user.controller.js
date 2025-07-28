import { User } from "../Models/user.model.js";
import { registerValidate,loginvalidate } from "../Middlewares/user.validate.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';


export const registerUser=async(req,res)=>{
    try{
        const { error } = registerValidate().validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser) return res.status(400).json({message:"Email already Exists"})

        const hashPassword=await bcrypt.hash(password,10);

        const user=await User.create({name,email,password:hashPassword});
        res.status(201).json({message:"User Created Sucessfully",user: {
        id: user._id,
        name: user.name,
        email: user.email,
    },})
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const loginUser=async(req,res)=>{
    try{
        const {error}=loginvalidate().validate(req.body);
        if(error) return res.status(400).json({message:error.details[0].message})
        
        const {email,password}=req.body

        const user=await User.findOne({email})
        if(!user) return res.status(400).json({message:"User not found"});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const token= jwt.sign({userId:user._id,email:user.email},process.env.SECRET_KEY,{expiresIn:"1d"})
        res.status(200).json({message:"User loged",user:{
            id:user._id,
            name:user.name,
            email:user.email
        },token})
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

}