import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {Song} from "../models/song.model.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";

const getAllSong = asyncHandler(async(req,res)=>{

    let data = await Song.find({})

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "data fetched successfully"
        )
    )
})

const getSongDetails = asyncHandler(async(req,res)=>{
    const {id} = req.body
    if(!id) throw new ApiError(401,"id is required")
    const songFound = await Song.findById(id)
    if(!songFound) throw new ApiError (400,"invalid id")
    
   let newSongObject = songFound.toObject()
    return res.status(200)
    .json(
        new ApiResponse(200,newSongObject,"details fetched succesfully")
    )
})

const addCommentOnSong = asyncHandler(async(req,res)=>{
    const {songId, description} = req.body

    const createdComment = await Comment.create({
            description,
            byUser:req.user,
            postedOn:"song",
            songId:songId
        })
        const songFound = await Song.findById(songId)
    if(!songFound) throw new ApiError (400,"invalid id")
        songFound.comments.push(createdComment)
    
        return res.status(200)
        .json(
           new ApiResponse(
            200,
            createdComment,
            "Comment Added Successfully"
           )
        )
})

const deleteCommentOnSong = asyncHandler (async(req,res)=>{
    const {_id} = req.body
    
    if(!_id) throw new ApiError(401,"invalid comment id")
    const response =  await Comment.findByIdAndDelete(_id);

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully deleted"
        )
    )
})

const getAllCommentsOnSong = asyncHandler (async(req,res)=>{
    const {songId} = req.body
    console.log(req.query);
    
    if(!songId) throw new ApiError(401,"invalid song id")
    const response =  await Comment.find({postedOn:'song', problemId:songId});

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully deleted"
        )
    )
})
export {
    getAllSong,
    getSongDetails,
    addCommentOnSong,
    deleteCommentOnSong,
    getAllCommentsOnSong
}