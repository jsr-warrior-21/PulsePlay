import express from 'express';
import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js'
const connectDB = async () =>{
    try {
     const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
     console.log(`mongoDB connected !! DB HOST : ${connectionInstance.connection.host} `);
    } catch (error) {
        console.log("Error in mongoDB connection : ",error);
        process.exit(1); // if failure happened in connection.
    }
}

export default connectDB;