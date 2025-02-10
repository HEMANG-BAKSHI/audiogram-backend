import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const confessionSchema = new Schema(
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
export const Confession = mongoose.model("Confession", confessionSchema)