import { Router } from "express";
import { 
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
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        }, 
    ]),
    registerUser
    )

router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/image").patch(verifyJWT, upload.single("image"), updateUserImage)

router.route('/userstory').post(verifyJWT,getUserStory)
router.route('/new-story').post(verifyJWT,upload.single("audio"),addStory)
// router.route('/new-event').post(upload.single("image"),addEventListing)
router.route('/delete-story').delete(verifyJWT,removeStory)

router.route('/userconfession').post(verifyJWT,getUserConfession)
router.route('/new-confession').post(verifyJWT,upload.single("audio"),addConfession)
// router.route('/new-event').post(upload.single("image"),addEventListing)
router.route('/delete-confession').delete(verifyJWT,removeConfession)

router.route('/userproblem').post(verifyJWT,getUserProblem)
router.route('/new-problem').post(verifyJWT,upload.single("audio"),addProblem)
// router.route('/new-event').post(upload.single("image"),addEventListing)
router.route('/delete-problem').delete(verifyJWT,removeProblem)

router.route('/usersong').post(verifyJWT,getUserSong)
router.route('/new-song').post(verifyJWT,upload.single("audio"),addSong)
// router.route('/new-event').post(upload.single("image"),addEventListing)
router.route('/delete-song').delete(verifyJWT,removeSong)

export default router