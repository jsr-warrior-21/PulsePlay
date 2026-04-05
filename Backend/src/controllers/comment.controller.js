import mongoose, { isValidObjectId } from "mongoose"
import { commentModel as Comment } from "../models/comment.model.js" // Aapke model file mein export 'commentModel' tha
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'

// 1. Get all comments for a video (with pagination)
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID")
    }

    // Aggregation pipeline to fetch comments with user details
    const aggregate = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
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
            $sort: { createdAt: -1 }
        }
    ])

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const comments = await Comment.aggregatePaginate(aggregate, options)

    if (!comments || comments.docs.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No comments found for this video"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"))
})

// 2. Add a comment to a video
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { content } = req.body

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user?._id
    })

    if (!comment) {
        throw new ApiError(500, "Something went wrong while adding the comment")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"))
})

// 3. Update a comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required to update comment")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    // Authorization check
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to update this comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: { content }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedComment, "Comment updated successfully"))
})

// 4. Delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    // Authorization check
    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You do not have permission to delete this comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}