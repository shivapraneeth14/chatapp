import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {Server} from "socket.io"
import {createServer} from "http"
import http from 'http';  

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
});


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
