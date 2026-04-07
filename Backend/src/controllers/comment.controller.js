import mongoose, { isValidObjectId } from "mongoose";
import { commentModel as Comment } from "../models/comment.model.js";
import { Notification } from "../models/notification.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// 1. Get all comments for a video
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user?._id; 

  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

  const aggregate = Comment.aggregate([
    { 
      $match: { video: new mongoose.Types.ObjectId(videoId) } 
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
      },
    },
    { $addFields: { owner: { $first: "$owner" } } },
    {
      $lookup: {
        from: "likemodels",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        isLiked: {
            $cond: {
                if: { $in: [new mongoose.Types.ObjectId(userId), "$likes.likedBy"] },
                then: true,
                else: false
            }
        }
      }
    },
    { $sort: { createdAt: -1 } },
    { $project: { likes: 0 } }, 
  ]);

  const options = { page: parseInt(page), limit: parseInt(limit) };
  const comments = await Comment.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(
      new ApiResponse(200, comments.docs || [], "Comments fetched successfully")
    );
});

// 2. Add a comment with notification
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) throw new ApiError(400, "Comment content is required");
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

  // Create the comment
  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  // Fetch video to get owner for notification
  const video = await Video.findById(videoId);
  if (video && video.owner.toString() !== req.user._id.toString()) {
    await Notification.create({
      user: video.owner,      // Video owner
      fromUser: req.user._id, // Commenter
      type: "comment",
      comment: comment._id,
      video: videoId,
      isRead: false,
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// 3. Update a comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) throw new ApiError(400, "Content is required");
  if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid Comment ID");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "You cannot update this comment");

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { content } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

// 4. Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid Comment ID");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "You cannot delete this comment");

  await Comment.findByIdAndDelete(commentId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };