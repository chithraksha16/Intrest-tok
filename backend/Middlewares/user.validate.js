import Joi from 'joi';

 export  const registerValidate = ()=>{
    return Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});
  }

export const loginvalidate=()=>{
    return Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(6).required()
    });
}

