import { Router } from "express";
import { 
    getAllStory,
    getStoryDetails,
    addCommentOnStory,
    deleteCommentOnStory,
    getAllCommentsOnStory
} from "../controllers/story.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

//secured routes
router.route("/get-all-story").post(verifyJWT, getAllStory)
router.route("/get-story-details").post(verifyJWT, getStoryDetails)
router.route("/add-comment-on-story").post(verifyJWT, addCommentOnStory)
router.route("/delete-comment-on-story").post(verifyJWT, deleteCommentOnStory)
router.route("/get-all-comments-on-story").post(verifyJWT, getAllCommentsOnStory)

export default router