import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// 1. Get all videos with optimized search and filters
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    
    const pipeline = []

    // Match Stage for search and filters
    const matchStage = { isPublished: true };

    if (userId) {
        if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid User ID")
        matchStage.owner = new mongoose.Types.ObjectId(userId)
    }

    if (query) {
        matchStage.$or = [
            { title: { $regex: query.trim(), $options: "i" } },
            { description: { $regex: query.trim(), $options: "i" } }
        ]
    }

    pipeline.push({ $match: matchStage })

    // Sorting logic
    const sortField = sortBy || "createdAt"
    const sortOrder = sortType === "asc" ? 1 : -1
    pipeline.push({ $sort: { [sortField]: sortOrder } })

    // Lookup Owner Details
    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $first: "$owner" }
            }
        }
    )

    const videoAggregate = Video.aggregate(pipeline)

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const videos = await Video.aggregatePaginate(videoAggregate, options)

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"))
})

// 2. Publish a video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if ([title, description].some((field) => !field?.trim())) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoFileLocalPath) throw new ApiError(400, "Video file is missing")
    if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail is missing")

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) throw new ApiError(400, "Video upload failed")

    const video = await Video.create({
        videoFile: videoFile.secure_url,
        thumbnail: thumbnail?.secure_url || "",
        title,
        description,
        duration: videoFile.duration,
        owner: req.user?._id,
        isPublished: true
    })

    return res
        .status(201)
        .json(new ApiResponse(201, video, "Video published successfully"))
})

// 3. Get Video By ID with SMART UNIQUE VIEWS logic
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

    const userId = req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null;

    const videoData = await Video.findById(videoId);
    if (!videoData) throw new ApiError(404, "Video not found");

    if (userId) {
        const isOwner = videoData.owner.toString() === userId.toString();
        // Check if user ID is NOT in the viewedBy array
        const hasNotViewed = !videoData.viewedBy.includes(userId);

        if (!isOwner && hasNotViewed) {
            await Video.findByIdAndUpdate(videoId, { 
                $addToSet: { viewedBy: userId },  
                $inc: { views: 1 }                
            });
        }
    } else {
       
    }
    // ------------------------------------

    const video = await Video.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "likemodels",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptionmodels",
                            localField: "_id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            subscribersCount: { $size: "$subscribers" },
                            isSubscribed: {
                                $cond: {
                                    if: { $in: [userId, "$subscribers.subscriber"] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                owner: { $first: "$owner" },
                isLiked: {
                    $cond: {
                        if: { $in: [userId, "$likes.likedBy"] },
                        then: true,
                        else: false
                    }
                }
            }
        }
    ]);

    if (!video?.length) throw new ApiError(404, "Video not found");

    return res.status(200).json(new ApiResponse(200, video[0], "Success"));
});

// 4. Update video
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailLocalPath = req.file?.path

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized request")
    }

    let thumbnail
    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title || video.title,
                description: description || video.description,
                thumbnail: thumbnail?.secure_url || video.thumbnail
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updated successfully"))
})

// 5. Delete video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized request")
    }

    await Video.findByIdAndDelete(videoId)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"))
})

// 6. Toggle Publish Status
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized request")
    }

    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, { isPublished: video.isPublished }, "Publish status toggled"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}