import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Confession } from "../models/confession.model.js";
import { Comment } from "../models/comment.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const getAllConfession = asyncHandler(async(req,res)=>{

    let data = await Confession.find({})

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "event data fetched successfully"
        )
    )
})

const getConfessionDetails = asyncHandler(async(req,res)=>{
    const {id} = req.body
    if(!id) throw new ApiError(401,"id is required")
    const confessionFound = await Confession.findById(id)
    if(!confessionFound) throw new ApiError (400,"invalid id")

   let newConfessionObject = confessionFound.toObject()

    return res.status(200)
    .json(
        new ApiResponse(200,newConfessionObject,"details fetched succesfully")
    )
})

const addCommentOnConfession = asyncHandler(async(req,res)=>{
    const {confessionId, description} = req.body

    const createdComment = await Comment.create({
            description,
            byUser:req.user,
            postedOn:"confession",
            confessionId:confessionId
        })
        const confessionFound = await Confession.findById(confessionId)
    if(!confessionFound) throw new ApiError (400,"invalid id")
        confessionFound.comments.push(createdComment)
    
        return res.status(200)
        .json(
           new ApiResponse(
            200,
            createdComment,
            "Comment Added Successfully"
           )
        )
})

const deleteCommentOnConfession = asyncHandler (async(req,res)=>{
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

const getAllCommentsOnConfession = asyncHandler (async(req,res)=>{
    const {confessionId} = req.body
    console.log(req.query);
    
    if(!confessionId) throw new ApiError(401,"invalid confession id")
    const response =  await Comment.find({postedOn:'confession', confessionId:confessionId});

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
    getAllConfession,
    getConfessionDetails,
    addCommentOnConfession,
    deleteCommentOnConfession,
    getAllCommentsOnConfession
}