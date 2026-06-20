import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!mongoose.Types.ObjectId.isValid(videoId))throw new ApiError(400, "Invalid videoId")
   let liked;
    const userId = req.user._id
    const existinglike = await Like.findOne({
      video: videoId,
      likedBy: userId  
    })
    if(existinglike){
        await Like.findByIdAndDelete(existinglike._id)
       liked = false    
    }
    else{ await Like.create({
            video: videoId,
           likedBy: userId
        })
      liked = true;    
    }
        return res
        .status(200)
        .json(new ApiResponse((200), {liked}, "toggle sucessfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    let liked = false
    if(!mongoose.Types.ObjectId.isValid(commentId))throw new ApiError(400, "invalid commentId")
    const userId = req.user._id
     comment = await Comment.findById(commentId)
     if(!comment)throw new ApiError(400, "comment not found")
    const existinglike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })
    if(existinglike){await Like.findOneAndDelete(existinglike._id)
        liked = false;
    }
    else{ await Like.create({
        comment: commentId,
        likedBy: userId
    })
   liked = true
}
    res
    .status(200)
    .json(new ApiResponse(200, {liked}, "comment like toggle successfully"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}