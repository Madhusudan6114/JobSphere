import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
// import authRoutes from "./routes/auth.js";
// import jobRoutes from "./routes/jobs.js";
import jobRoutes from './routes/jobRoutes.js';
dotenv.config();
const app=express();
const PORT=process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobsphere';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.get('/api/health',(res,req)=>{
    req.status(200).json({status:'Jobsphere server is running'})
});
mongoose
.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MONGODB connected successfully");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});

