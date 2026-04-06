import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { subscriptionModel as Subscription } from "../models/subscription.model.js";
import { likeModel as Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }

    const stats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "likemodels",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
                totalVideos: { $sum: 1 },
                totalLikes: { $sum: { $size: "$likes" } }
            }
        }
    ]);

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    const statsData = stats[0] || {};

    const channelStats = {
        totalViews: statsData.totalViews || 0,
        totalVideos: statsData.totalVideos || 0,
        totalLikes: statsData.totalLikes || 0,
        totalSubscribers
    };

    return res
        .status(200)
        .json(new ApiResponse(200, channelStats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }

    const videos = await Video.find({
        owner: userId
    }).sort({ createdAt: -1 });

    if (videos.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No videos found for this channel"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export {
    getChannelStats,
    getChannelVideos
};