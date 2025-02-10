import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {Problem} from "../models/problem.model.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";

const getAllProblem = asyncHandler(async(req,res)=>{

    let data = await Problem.find({})

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "event data fetched successfully"
        )
    )
})

const getProblemDetails = asyncHandler(async(req,res)=>{
    const {id} = req.body
    if(!id) throw new ApiError(401,"id is required")
    const problemFound = await Problem.findById(id)
    if(!problemFound) throw new ApiError (400,"invalid id")
    
   let newProblemObject = problemFound.toObject()
    return res.status(200)
    .json(
        new ApiResponse(200,newProblemObject,"details fetched succesfully")
    )
})

const addCommentOnProblem = asyncHandler(async(req,res)=>{
    const {problemId, description} = req.body

    const createdComment = await Comment.create({
            description,
            byUser:req.user,
            postedOn:"problem",
            problemId:problemId
        })
        const problemFound = await Problem.findById(problemId)
    if(!problemFound) throw new ApiError (400,"invalid id")
        problemFound.comments.push(createdComment)
    
        return res.status(200)
        .json(
           new ApiResponse(
            200,
            createdComment,
            "Comment Added Successfully"
           )
        )
})

const deleteCommentOnProblem = asyncHandler (async(req,res)=>{
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

const getAllCommentsOnProblem = asyncHandler (async(req,res)=>{
    const {problemId} = req.body
    console.log(req.query);
    
    if(!problemId) throw new ApiError(401,"invalid problem id")
    const response =  await Comment.find({postedOn:'problem', problemId:problemId});

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
    getAllProblem,
    getProblemDetails,
    addCommentOnProblem,
    deleteCommentOnProblem,
    getAllCommentsOnProblem
}