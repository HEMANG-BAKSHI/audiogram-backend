import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { Story } from "../models/story.model.js";
import { Confession } from "../models/confession.model.js";
import { Problem } from "../models/problem.model.js";
import { Song } from "../models/song.model.js";
import mongoose from "mongoose";


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, username, password} = req.body
    
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    const user = await User.create({
        fullName,
        image: coverImage? coverImage : "",
        username,
        email, 
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    
    // if (!username && !email) {
    //     throw new ApiError(400, "username or email is required")
    // }
    
    // Here is an alternative of above code based on logic discussed in video:
    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserImage = asyncHandler(async(req, res) => {
    const imageLocalPath = req.file?.path
    
    if (!imageLocalPath) {
        throw new ApiError(400, "image file is missing")
    }
    
    //TODO: delete old image - assignment
    
    
    const image = await uploadOnCloudinary(imageLocalPath)
    console.log(image);

    if (!image) {
        throw new ApiError(400, "Error while uploading")   
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                image: image
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Image updated successfully")
    )
})

const addStory = asyncHandler(async(req,res)=>{
    
    const {caption, tags} = req.body
   
    if(!caption || !tags) throw new ApiError(401,"All feilds required")
    console.log(req.file)
    
    let audioPath=""
// console.log(req.files);

    if(req.file){
        
            // console.log("inside files loop");
            const path = req.file?.path
            
            // console.log("paths is ",path);
            const res = await uploadOnCloudinary(path)
            // console.log(res);
            audioPath=res
            console.log(audioPath);
        // }
    }
    else{
        throw new ApiError(401,"Audio is required")
    }


    const createdStory = await Story.create({
        caption, 
        tags,
        audio:audioPath,
        plays:0,
        createdBy:req.user
    })

    return res.status(200)
    .json(
       new ApiResponse(
        200,
        createdStory,
        "Posted Successfully"
       )
    )
})

const addConfession = asyncHandler(async(req,res)=>{
    const {title, summary, tags} = req.body
   
    if(!title || !summary || !tags) throw new ApiError(401,"All feilds required")
    // console.log(req.files)
    
    let audioPath=""
// console.log(req.files);

    if(req.file){
        
            // console.log("inside files loop");
            const path = req.file?.path
            
            // console.log("paths is ",path);
            const res = await uploadOnCloudinary(path)
            // console.log(res);
            audioPath=res
            console.log(audioPath);
        // }
    }
    else{
        throw new ApiError(401,"Audio is required")
    }


    const createdConfession = await Confession.create({
        title, 
        summary,
        audio:audioPath,
        plays:0,
        createdBy:req.user,
        tags
    })

    return res.status(200)
    .json(
       new ApiResponse(
        200,
        createdConfession,
        "Posted Successfully"
       )
    )
})

const addProblem = asyncHandler(async(req,res)=>{
    const {title, summary, tags} = req.body
   
    if(!title || !summary || !tags) throw new ApiError(401,"All feilds required")
    // console.log(req.files)
    
    let audioPath=""
    // console.log(req.files);
    
        if(req.file){
            
                // console.log("inside files loop");
                const path = req.file?.path
                
                // console.log("paths is ",path);
                const res = await uploadOnCloudinary(path)
                // console.log(res);
                audioPath=res
                console.log(audioPath);
            // }
        }
        else{
            throw new ApiError(401,"Audio is required")
        }


    const createdProblem = await Problem.create({
        title, 
        summary,
        audio:audioPath,
        plays:0,
        createdBy:req.user,
        tags
    })

    return res.status(200)
    .json(
       new ApiResponse(
        200,
        createdProblem,
        "Posted Successfully"
       )
    )
})

const addSong = asyncHandler(async(req,res)=>{
    const {caption, tags} = req.body
   
    if(!caption || !tags) throw new ApiError(401,"All feilds required")
    // console.log(req.files)
    
    let audioPath=""
    // console.log(req.files);
    
        if(req.file){
            
                // console.log("inside files loop");
                const path = req.file?.path
                
                // console.log("paths is ",path);
                const res = await uploadOnCloudinary(path)
                // console.log(res);
                audioPath=res
                console.log(audioPath);
            // }
        }
        else{
            throw new ApiError(401,"Audio is required")
        }

    const createdSong = await Song.create({
        caption,
        audio:audioPath,
        plays:0,
        createdBy:req.user,
        tags
    })

    return res.status(200)
    .json(
       new ApiResponse(
        200,
        createdSong,
        "Posted Successfully"
       )
    )
})

const getUserStory = asyncHandler(async(req,res)=>{
    const data = await Story.find({createdBy:req.user?._id})
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "userListings fetched successfully"
        )
    )
})

const getUserConfession = asyncHandler(async(req,res)=>{
    const data = await Confession.find({createdBy:req.user?._id})
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "userListings fetched successfully"
        )
    )
})

const getUserProblem = asyncHandler(async(req,res)=>{
    const data = await Problem.find({createdBy:req.user?._id})
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "userListings fetched successfully"
        )
    )
})

const getUserSong = asyncHandler(async(req,res)=>{
    const data = await Song.find({createdBy:req.user?._id})
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "userListings fetched successfully"
        )
    )
})

const removeStory = asyncHandler (async(req,res)=>{
    const {_id} = req.body
    console.log(req.query);
    
    if(!_id) throw new ApiError(401,"invalid property id")
    const response =  await Story.findByIdAndDelete(_id);

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully deleted"
        )
    )
})

const removeConfession = asyncHandler (async(req,res)=>{
    const {_id} = req.body
    console.log(req.query);
    
    if(!_id) throw new ApiError(401,"invalid property id")
    const response =  await Confession.findByIdAndDelete(_id);

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully deleted"
        )
    )
})

const removeProblem = asyncHandler (async(req,res)=>{
    const {_id} = req.body
    console.log(req.query);
    
    if(!_id) throw new ApiError(401,"invalid property id")
    const response =  await Problem.findByIdAndDelete(_id);

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            response,
            "successfully deleted"
        )
    )
})

const removeSong = asyncHandler (async(req,res)=>{
    const {_id} = req.body
    console.log(req.query);
    
    if(!_id) throw new ApiError(401,"invalid property id")
    const response =  await Song.findByIdAndDelete(_id);

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
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserImage,
    addStory,
    addConfession,
    addProblem,
    addSong,
    getUserStory,
    getUserConfession,
    getUserProblem,
    getUserSong,
    removeStory,
    removeConfession,
    removeProblem,
    removeSong
}