import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const postSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        createdBy:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        audio: {
            type: String, // cloudinary url
        },
        comments:[
            {
                type: Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    },
    {
        timestamps: true
    }
)
export const Post = mongoose.model("Post", postSchema)