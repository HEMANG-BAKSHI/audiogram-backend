import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from "./routes/user.route.js"
import storyRouter from "./routes/story.route.js"
import confessionRouter from "./routes/confession.route.js"
import songRouter from "./routes/song.route.js"
import problemRouter from "./routes/problem.route.js"
//routes declaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/story", storyRouter)
app.use("/api/v1/song", songRouter)
app.use("/api/v1/confession", confessionRouter)
app.use("/api/v1/problem", problemRouter)

// http://localhost:8000/api/v1/users/register

export { app }