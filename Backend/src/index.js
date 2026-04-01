/*
---> first approach not good practice
const app = express();
import express from 'express'
import { DB_NAME } from './constants'
import mongoose from 'mongoose'
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error",(error)=>{
             console.log(error);
             throw error;
        });
        app.listen(process.env.PORT,()=>{
            console.log(`server started on PORT : ${process.env.PORT}`)
        });
    } catch (error) {
        console.log("Error : ", error);
        throw error;
    }
})(); 
*/

import 'dotenv/config';
import express from 'express';
import connectDB from './db/db.js';
const app = express();
await connectDB();
app.listen(process.env.PORT,()=>{
    console.log('server started on the port : ',process.env.PORT);
})


