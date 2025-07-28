import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnection from './config/mongo.config.js';
import userRoutes from './Routes/user.route.js';
import questionRouter from './Routes/question.route.js';
import answerRouter from './Routes/answer.route.js';
import commentRouter from './Routes/comment.route.js'


dotenv.config();

const app=express();
const PORT=process.env.PORT || 3000 ;

await dbConnection();

//middlewares
app.use(express.json());

app.use(cors({
    origin:'http://localhost:5173',
    methods:["GET","POST","PUT", "PATCH","DELETE"],
    credentials:true
}))


//api routes
app.use('/api',userRoutes);
app.use('/api',questionRouter);
app.use('/api',answerRouter);
app.use('/api',commentRouter);






app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);
})