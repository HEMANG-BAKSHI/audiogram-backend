import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const storySchema = new Schema(
    {
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
        ],
        caption: {
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
export const Story = mongoose.model("Story", storySchema)