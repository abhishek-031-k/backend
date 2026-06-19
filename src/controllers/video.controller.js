import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { v2 } from "cloudinary"

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
    if(!mongoose.Types.ObjectId.isValid(videoId))throw new ApiError(400, "invalid video id")
    
    const video = await Video.find(videoId)
    if(!video)throw new ApiError(404, "video not found")
       res
      .status(200)
      .json(new ApiResponse(200, video, "video fetched successfully")) 
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId))throw new ApiError(401, "video is not present")

    const video = await Video.findById(videoId)
    if(!video)throw new ApiError(404, "video not found") 
        
    if(video.owner.toString() !== req.user._id.toString())throw new ApiError(403, "unauthorized")

    const {title, description} = req.body
    if(!title && !description && !req.file)throw new ApiError(400, "one field must be required")

    const thumbnailpath = req.file?.path

    if(!thumbnail)throw new ApiError(401, "thumbnail upload failed")
    const thumbnail = await uploadOnCloudinary(thumbnailpath)
        video.thumbnail = thumbnail.url
      
     if(title)video.title = title;
     if(description)video.description = description
     await video.save({validateBeforSave: false})

     const updatedVideo = await Video.findById(videoId)
     
     return res
     .status(200)
     .json(new ApiResponse(200, updatedVideo, "video updated successfully"))
   

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId))throw new ApiError(400, "video already not present")
    
    const video = await Video.findById(videoId)
    if(!video)throw new ApiError(404, "video not present")
    if(video.owner.toString() !== req.user._id.toString())throw new ApiError(403, "unauthorized access")

   const getPublicId = (url)=>{
    const parts = url.split("/")
    const fileName = parts.pop().split(".")[0]
        return fileName
   }

   const thumbnailpublicId = getPublicId(video.thumbnail)
   await Cloudinary.uploader.destroy(thumbnailpublicId)

   const videopublicId = getPublicId(video.videoFile)
   await  Cloudinary.uploader.destroy(videopublicId,
    {resource_type: "video"

    }
   )
   await video.deleteOne();

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "video deleted successfully"))

    
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