import mongoose, { isValidObjectId } from "mongoose"
import { tweetModel as Tweet } from "../models/tweet.model.js"
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { v2 as cloudinary } from "cloudinary" 

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    let imageUrl = "";
    if (req.file) {
        const uploadedFile = await uploadOnCloudinary(req.file.path);
        if (uploadedFile) {
            imageUrl = uploadedFile.url;
        }
    }

    const tweet = await Tweet.create({
        content,
        image: imageUrl, 
        owner: req.user?._id
    })

    const fullTweet = await Tweet.findById(tweet._id).populate("owner", "username avatar");

    return res.status(201).json(
        new ApiResponse(201, fullTweet, "Tweet created successfully")
    );
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID")
    }

    const tweets = await Tweet.find({ owner: userId })
        .populate("owner", "username avatar fullName")
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(new ApiResponse(200, tweets || [], "User tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) throw new ApiError(404, "Tweet not found")

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized request")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: { content } },
        { new: true }
    ).populate("owner", "username avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))
})

// 🔥 Naya Function: Sirf Image Delete karne ke liye
const deleteTweetImage = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) throw new ApiError(404, "Tweet not found")

    // Authorization Check
    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized request")
    }

    if (!tweet.image) {
        throw new ApiError(400, "No image found in this tweet")
    }

    // 1. Delete from Cloudinary
    try {
        const publicId = tweet.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary delete error:", error);
    }

    // 2. Clear image field in Database
    tweet.image = "";
    await tweet.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Image removed successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) throw new ApiError(404, "Tweet not found")

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized request")
    }

    if (tweet.image) {
        try {
            const publicId = tweet.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Cloudinary delete error:", error);
        }
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    deleteTweetImage  
}