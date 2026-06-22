import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
     const channelId = req.user._id;

    // Total videos
    const totalVideos = await Video.countDocuments({
        owner: channelId
    });

    // Total views
    const viewStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ]);

    const totalViews = viewStats[0]?.totalViews || 0;

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId
    });

    // Get all video ids of this channel
    const videos = await Video.find(
        { owner: channelId },
        { _id: 1 }
    );

    const videoIds = videos.map(video => video._id);

    // Total likes on all channel videos
    const totalLikes = await Like.countDocuments({
        video: {
            $in: videoIds
        }
    });
//console.log(fh);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalViews,
                totalSubscribers,
                totalLikes
            },
            "Channel stats fetched successfully"
        )
    );
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.user._id
    const videos = await Video.find({owner: channelId})

    res
    .status(200)
    .json(new ApiResponse(200, {videos}, "all videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }