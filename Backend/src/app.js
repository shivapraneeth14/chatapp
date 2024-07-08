import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended:true,
    limit: '50mb'

}))
app.use(cookieParser())
app.use(express.static("Public"))

import router from "./Routes/User.Routes.js"

app.use("/api",router)


export default app
