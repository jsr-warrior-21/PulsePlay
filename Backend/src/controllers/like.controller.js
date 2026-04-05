import mongoose, { isValidObjectId } from "mongoose"
import { likeModel as Like } from "../models/like.model.js"
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    // Check if video was already liked by this user
    const likedAlready = await Like.findOne({
        video: videoId,
        likedBy: userId
    })

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready._id)
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Unliked successfully"))
    }

    await Like.create({
        video: videoId,
        likedBy: userId
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Liked successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const likedAlready = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready._id)
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Unliked successfully"))
    }

    await Like.create({
        comment: commentId,
        likedBy: userId
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Liked successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const likedAlready = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    })

    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready._id)
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Unliked successfully"))
    }

    await Like.create({
        tweet: tweetId,
        likedBy: userId
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Liked successfully"))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    // Aggregation pipeline to get all videos liked by the user
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $exists: true }
            }
        },
        {
            $lookup: {
                from: "videos", // Ensure this matches your video collection name
                localField: "video",
                foreignField: "_id",
                as: "likedVideo",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$ownerDetails" }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$likedVideo"
        },
        {
            $replaceRoot: { newRoot: "$likedVideo" }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}