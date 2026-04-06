import mongoose, { isValidObjectId } from "mongoose"
import { likeModel as Like } from "../models/like.model.js"
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized request")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const deleted = await Like.findOneAndDelete({
        video: videoId,
        likedBy: userId
    })

    if (deleted) {
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

    if (!userId) {
        throw new ApiError(401, "Unauthorized request")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const deleted = await Like.findOneAndDelete({
        comment: commentId,
        likedBy: userId
    })

    if (deleted) {
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

    if (!userId) {
        throw new ApiError(401, "Unauthorized request")
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const deleted = await Like.findOneAndDelete({
        tweet: tweetId,
        likedBy: userId
    })

    if (deleted) {
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

    if (!userId) {
        throw new ApiError(401, "Unauthorized request")
    }

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
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
                    },
                    {
                        $project: {
                            ownerDetails: 0
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