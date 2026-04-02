import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import cookiePraser from 'cookie-parser'
export const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"})); // encoding comming data from the url
app.use(express.static("public")) // render a html file directly from the backend like image ,favicon we will store in public
app.use(cookiePraser());