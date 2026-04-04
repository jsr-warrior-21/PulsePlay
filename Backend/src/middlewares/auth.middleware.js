import { User } from "../models/users.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request.");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalide access Token.");
    }

    // if confirmed that user present  then uske hi request me user ko bhej do
    /**
     * Middleware ek function hota hai jo route handler se pehle chalta hai. Jab aap req.user = user karte hain, toh aap us user ka saara data (jo aapne database se nikala hai) req object mein "attach" kar dete hain.
    *Iska fayda ye hai ki iske baad aane wale jitne bhi functions ya routes hain, unhe phir se database query karne ki zaroorat nahi padti. Unhe user ki info directly req.user se mil jati hai.
    */
   
   req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalide access token");
  }
});

export { verifyJWT };
