import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { subscriptionModel as Subscription } from "../models/subscription.model.js";
import { likeModel as Like } from "../models/like.model.js";
import { commentModel as Comment } from "../models/comment.model.js";
import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) throw new ApiError(401, "Unauthorized request");

  // 1️ Channel Stats
  const statsAgg = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "likemodels",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
        totalVideos: { $sum: 1 },
        totalLikes: { $sum: { $size: "$likes" } },
      },
    },
  ]);

  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  const channelsSubscribedTo = await Subscription.countDocuments({
  subscriber: userId,
});

  const statsData = statsAgg[0] || {};
  const stats = {
    totalViews: statsData.totalViews || 0,
    totalVideos: statsData.totalVideos || 0,
    totalLikes: statsData.totalLikes || 0,
    totalSubscribers,
    channelsSubscribedTo
  };

  // 2️ User Videos
  const videos = await Video.find({ owner: userId }).sort({ createdAt: -1 });

  // 3️ Notifications
  const notifications = await Notification.find({ user: userId })
    .populate("fromUser", "username fullName avatar")
    .populate("video", "title thumbnail")
    .populate("comment", "content")
    .sort({ createdAt: -1 });

  const unreadNotifications = await Notification.countDocuments({
    user: userId,
    isRead: false,
  });

  // 4️ Liked Videos
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $ne: null },
      },
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
              pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
            },
          },
          { $addFields: { owner: { $first: "$ownerDetails" } } },
          { $project: { ownerDetails: 0 } },
        ],
      },
    },
    { $unwind: "$likedVideo" },
    { $replaceRoot: { newRoot: "$likedVideo" } },
  ]);

  // 5️ Comments by User
  const userComments = await Comment.find({ owner: userId }).sort({
    createdAt: -1,
  });

  // 6️ Subscriptions by User
  const subscribedChannels = await Subscription.aggregate([
    { $match: { subscriber: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
        pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
      },
    },
    { $unwind: "$channelDetails" },
    { $replaceRoot: { newRoot: "$channelDetails" } },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stats,
        videos,
        likedVideos,
        userComments,
        subscribedChannels,
        notifications,
        unreadNotifications,
      },
      "Dashboard data fetched successfully"
    )
  );
});

export { getDashboardData };
