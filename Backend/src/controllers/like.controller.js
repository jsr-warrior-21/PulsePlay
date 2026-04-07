import mongoose, { isValidObjectId } from "mongoose";
import { likeModel as Like } from "../models/like.model.js";
import { Notification } from "../models/notification.model.js";
import { Video } from "../models/video.model.js";
import { commentModel as Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Helper to create notification
const createLikeNotification = async ({ userId, targetUserId, type, videoId, commentId }) => {
  if (userId.toString() === targetUserId.toString()) return; // Don't notify self
  await Notification.create({
    user: targetUserId,
    fromUser: userId,
    type, // 'video_like' or 'comment_like'
    video: videoId || null,
    comment: commentId || null,
    isRead: false,
  });
};

// Toggle video like
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    const alreadyLiked = await Like.findOne({ video: videoId, likedBy: req.user?._id });

    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked._id);
        return res.status(200).json(new ApiResponse(200, { isLiked: false }, "Unliked"));
    } else {
        await Like.create({ video: videoId, likedBy: req.user?._id });

        if (video.owner.toString() !== req.user?._id.toString()) {
            await Notification.create({
                user: video.owner, // Recipient
                fromUser: req.user?._id, // Sender
                type: "video_like",
                video: videoId,
            });
        }

        return res.status(200).json(new ApiResponse(200, { isLiked: true }, "Liked"));
    }
});

// Toggle comment like
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment ID");

  const existing = await Like.findOne({ comment: commentId, likedBy: userId });

  if (existing) {
    await existing.deleteOne();
    return res.status(200).json(new ApiResponse(200, { isLiked: false }, "Comment unliked successfully"));
  }

  const like = await Like.create({ comment: commentId, likedBy: userId });

  const comment = await Comment.findById(commentId);
  if (comment) {
    await createLikeNotification({
      userId,
      targetUserId: comment.owner,
      type: "comment_like",
      commentId,
      videoId: comment.video,
    });
  }

  return res.status(200).json(new ApiResponse(200, { isLiked: true }, "Comment liked successfully"));
});

// Toggle tweet like
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");

  const existing = await Like.findOne({ tweet: tweetId, likedBy: userId });

  if (existing) {
    await existing.deleteOne();
    return res.status(200).json(new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully"));
  }

  await Like.create({ tweet: tweetId, likedBy: userId });

  return res.status(200).json(new ApiResponse(200, { isLiked: true }, "Tweet liked successfully"));
});

// Get all liked videos of the user
const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await Like.aggregate([
    { $match: { likedBy: new mongoose.Types.ObjectId(userId), video: { $ne: null } } },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
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
    { $unwind: "$videoDetails" },
    { $replaceRoot: { newRoot: "$videoDetails" } },
  ]);

  return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };