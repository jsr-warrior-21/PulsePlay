import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // encoding comming data from the url
app.use(express.static("public")); // render a html file directly from the backend like image ,favicon we will store in public
app.use(cookieParser());

/**
 * SummaryTable Middleware TargetData Purpose 
 * json          JSON         Bodyreq.body ko populate karna.
 * urlencoded    URLData      URL ke special characters decode karna.
 * static        Files        Images/Assets ko directly server se dikhana.
 * cookieParser  Cookies       User ki browser cookies ko access/set karna.
 */

// importing of router

import userRouter from "./routes/user.routes.js";

//router declaration

app.use("/api/v1/users", userRouter);

/**
 * Yahan aapne Express ko bataya ki jab bhi koi request /api/v1/users se shuru ho, toh usse userRouter ke paas bhej do.
 */
