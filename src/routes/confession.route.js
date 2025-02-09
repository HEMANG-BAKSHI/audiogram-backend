import { Router } from "express";
import { 
    getAllConfession,
    getConfessionDetails,
    addCommentOnConfession,
    deleteCommentOnConfession,
    getAllCommentsOnConfession
} from "../controllers/confession.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

//secured routes
router.route("/get-all-confession").post(verifyJWT, getAllConfession)
router.route("/get-confession-details").post(verifyJWT, getConfessionDetails)
router.route("/add-comment-on-confession").post(verifyJWT, addCommentOnConfession)
router.route("/delete-comment-on-confession").post(verifyJWT, deleteCommentOnConfession)
router.route("/get-all-comments-on-confession").post(verifyJWT, getAllCommentsOnConfession)

export default router