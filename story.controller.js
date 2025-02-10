import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { Comment } from "../models/comment.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {Story} from "../models/story.model.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const getAllStory = asyncHandler(async(req,res)=>{

    let data = await Story.find({})

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "data fetched successfully"
        )
    )
})

const getStoryDetails = asyncHandler(async(req,res)=>{
    const {_id} = req.body
    if(!_id) throw new ApiError(401,"id is required")
    const storyFound = await Story.findById(_id)
    if(!storyFound) throw new ApiError (400,"invalid id")
    
   let newStoryObject = storyFound.toObject()
    return res.status(200)
    .json(
        new ApiResponse(200,newStoryObject,"details fetched succesfully")
    )
})

const addCommentOnStory = asyncHandler(async(req,res)=>{
    const {storyId, description} = req.body
    console.log(req.body);
    
    const createdComment = await Comment.create({
            description,
            byUser:req.user,
            postedOn:"story",
            storyId:storyId
        })
        const storyFound = await Story.findById(storyId)
    if(!storyFound) throw new ApiError (400,"invalid id")
        storyFound.comments.push(createdComment)
    
        return res.status(200)
        .json(
           new ApiResponse(
            200,
            createdComment,
            "Comment Added Successfully"
           )
        )
})

const deleteCommentOnStory = asyncHandler (async(req,res)=>{
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

const getAllCommentsOnStory = asyncHandler (async(req,res)=>{
    const {storyId} = req.body
    console.log(req.body);
    
    if(!storyId) throw new ApiError(401,"invalid story id")
    const response =  await Comment.find({postedOn:"story", storyId:storyId});

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully fetched"
        )
    )
})

export {
    getAllStory,
    getStoryDetails,
    addCommentOnStory,
    deleteCommentOnStory,
    getAllCommentsOnStory
}