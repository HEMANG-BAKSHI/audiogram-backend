import { Router } from "express";
import { 
    getAllSong,
    getSongDetails,
    addCommentOnSong,
    deleteCommentOnSong,
    getAllCommentsOnSong
} from "../controllers/song.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

//secured routes
router.route("/get-all-song").post(verifyJWT, getAllSong)
router.route("/get-song-details").post(verifyJWT, getSongDetails)
router.route("/add-comment-on-song").post(verifyJWT, addCommentOnSong)
router.route("/delete-comment-on-song").post(verifyJWT, deleteCommentOnSong)
router.route("/get-all-comments-on-song").post(verifyJWT, getAllCommentsOnSong)

export default router