// require('dotenv').config({path: './env'})
// import dotenv from "dotenv"
// import connectDB from "./db/index.js";
// import {app} from './app.js'
// import mongoose   from "mongoose";
// dotenv.config({
//     path: './.env'
// })

// connectDB()
// .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//     })
// })
// .catch((err) => {
//     console.log("MONGO db connection failed !!! ", err);
// })

// ;(async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
//         app.listen(process.env.PORT || 3000,()=>{
//             console.log(`server is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("MongoDb connection error !! ",error)
//         throw error
//     }
// })()

import dotenv from "dotenv"
import {app} from './app.js'
import mongoose   from "mongoose";
dotenv.config({
    path: './.env'
})

;(async()=>{
    try {
        const db = await mongoose.connect('mongodb://localhost:27017/EventDB');
        console.log("Mongo DB connected Successfully !!!");
        app.listen(process.env.PORT || 4000, () => {
            console.log("Server is running at port : ${process.env.PORT}");
        })
    } catch (error) {
        console.log("mongodb connection error",error);
    }
})()

/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/