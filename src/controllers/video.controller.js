import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title || !description)throw new ApiError(400, "title or description is missing")

    const videoLocalpath = req.files?.videoFile?.[0]?.path
   const thumbnailpath = req.files?.thumbnail?.[0]?.path

   if(!videoLocalpath)throw new ApiError(400, "video file is required")
    if(!thumbnailpath)throw new ApiError(400, "thumbnail is required")
   
        const video = await uploadOnCloudinary(videoLocalpath)
        if(!video)throw new ApiError(500, "video upload failed")

            const thumbnail = await uploadOnCloudinary(thumbnailpath)
            if(!thumbnail)throw new ApiError(500, "thumbnail upload failed")

     const createVideo = await Video.create({
       videoFile: video.url,
       thumbnail: thumbnail.url,
       title,
       description,
       duration: video.duration,
       owner: req.user._id
     })

     const uploadedVideo = await Video.findById(createVideo._id)
     if(!uploadedVideo)throw new ApiError(500, "failed to create video")

     return res
     .status(201)
     .json(new ApiResponse(201, uploadedVideo, "video uploaded successfully"))
    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}