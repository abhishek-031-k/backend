import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist
  if (!name?.trim() || !description?.trim())
    throw new ApiError(400, "name and description are required");

  const playlist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    owner: req.user._id,
  });
  if (!Playlist) throw new ApiError(500, "failed to create playlist");

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new ApiError(400, "user not found");
  const userplaylist = await Playlist.find({
    owner: userId,
  }).populate("videos");

  if (userplaylist === 0) throw new ApiError(401, "playlist not found");

  return res
    .status(200)
    .json(new ApiResponse(200, userplaylist, "user playlist found"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(playlistId))
    throw new ApiError(400, "playlist not found");
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "playlist not found");
  return res.status(200).json(new ApiResponse(200, playlist, "playlist found"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(playlistId))
    throw new ApiError(400, "Invalid playlist Id");
  if (!mongoose.Types.ObjectId.isValid(videoId))
    throw new ApiError(400, "Invalid video Id");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "playlist not found");
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "video not found");
  const updatedplaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: videoId,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedplaylist,
        "video added to playlist successfully"
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!mongoose.Types.ObjectId.isValid(playlistId))
    throw new ApiError(400, "Invalid playlist Id");
  if (!mongoose.Types.ObjectId.isValid(videoId))
    throw new ApiError(400, "Invalid video Id");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "playlist not found");
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "video not found");
  const updatedplaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  );
   return res
    .status(200)
    .json(new ApiResponse(200, updatedplaylist, "video removed successfully"));
});
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!name?.trim() && !description?.trim()) {
    throw new ApiError(400, "At least one field is required");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "playlist not found");
  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "unauthorized access");
  }

  const updatedplaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      name,
      description,
    },
    { new: true }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedplaylist,
        "playlist details updated successfully"
      )
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
