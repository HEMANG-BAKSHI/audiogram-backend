import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const problemSchema = new Schema(
    {
        createdBy:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        audio: {
            type: String // cloudinary url
        },
        comments:[
            {
                type: Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],
        title: {
            type: String
        },
        summary: {
            type: String
        },
        plays:{
            type:Number
        },
        tags:[
            {
                type:String
            }
        ]
    },
    {
        timestamps: true
    }
)
export const Problem = mongoose.model("Problem", problemSchema)