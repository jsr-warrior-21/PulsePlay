import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { subscriptionModel as Subscription } from "../models/subscription.model.js"
import { likeModel as Like } from "../models/like.model.js"
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'

const getChannelStats = asyncHandler(async (req, res) => {
    // req.user._id se hum logged-in channel ke stats nikalenge
    const userId = req.user?._id;

    try {
        const stats = await Video.aggregate([
            // 1. Is channel ke saare videos match karo
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            // 2. Likes count karne ke liye Like collection se join karo
            {
                $lookup: {
                    from: "likemodels",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes"
                }
            },
            // 3. Stats calculate karo
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                    totalVideos: { $sum: 1 },
                    totalLikes: { $sum: { $size: "$likes" } }
                }
            }
        ]);

        // 4. Total subscribers count karo (Subscription Model se)
        const totalSubscribers = await Subscription.countDocuments({
            channel: userId
        });

        const channelStats = {
            totalViews: stats[0]?.totalViews || 0,
            totalVideos: stats[0]?.totalVideos || 0,
            totalLikes: stats[0]?.totalLikes || 0,
            totalSubscribers
        };

        return res
            .status(200)
            .json(new ApiResponse(200, channelStats, "Channel stats fetched successfully"));

    } catch (error) {
        throw new ApiError(500, "Error while fetching channel stats");
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    // Is channel dwara upload kiye gaye saare videos fetch karo
    const videos = await Video.find({
        owner: userId
    }).sort({ createdAt: -1 }); // Latest videos pehle

    if (!videos) {
        return res.status(200).json(new ApiResponse(200, [], "No videos found for this channel"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
})

export {
    getChannelStats,
    getChannelVideos
}