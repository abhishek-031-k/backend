import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId))throw new ApiError(400, "Invalid videoId")
    const video = await Video.findById(videoId);
    if(!video)throw new ApiError(404, "video not found")

    const {content} = req.body
    if(!content?.trim())throw new ApiError(400, "content needed")

    const comment = await Comment.create({
         content,
        video: videoId,
        owner: req.user._id
    })
    return res.status(201).json(new ApiResponse(201, comment, "comment add successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    if(!mongoose.Types.ObjectId.isValid(commentId))throw new ApiError(400, "invalid Id")
    if(!content?.trim())throw new ApiError(400, "content required to update") 
        
       const comment = await Comment.findById(commentId)
       if(!comment)throw new ApiError(404, "comment not exist") 

       if(req.user._id.toString() !== comment.owner.toString())throw new ApiError(403, "unauthorized access")
        const updatedComment = await Comment.findByIdAndUpdate( commentId,{
           content
        }, {new: true})

        if(!updatedComment)throw new ApiError(500, "update comment failed")
            return res.status(200).json(new ApiResponse(200, updatedComment, "comment updated suucessfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
      const {commentId} = req.params
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }