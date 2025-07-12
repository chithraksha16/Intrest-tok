import mongoose from "mongoose";

const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,
        {
            dbName:"Intrest_tok"
        }
    )
    .then(()=>console.log("MongoDB Connected"))
    .catch((err)=>console.error("Connection Failed",err));
}


export default dbConnection;