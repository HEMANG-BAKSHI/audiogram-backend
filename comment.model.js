import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const commentSchema = new Schema(
    {
        description: {
            type: String,
            required: true,
        },
        byUser: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        postedOn: {
            type: String,
        },
        storyId: {
            type:String
        },
        confessionId: {
            type:String
        },
        songId: {
            type:String
        },
        problemId: {
            type:String
        },
    },
    {
        timestamps: true
    },
    {
        strict:false
    }
)

export const Comment = mongoose.model("Comment", commentSchema)

