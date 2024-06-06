import dotenv from "dotenv"
import connect from "./db/index.js";
import app from "./app.js";
import {Server} from "socket.io"
import {createServer} from "http"
import http from 'http';  
import { markAsUntransferable } from "worker_threads";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});
let activeusers = []
let roomid ;

io.on('connection', (socket) => {
  console.log(`socket id`,socket.id)
  
  socket.on("join_room", (roomid,username) => {
    console.log("join romm",roomid,username)
    const newuser = {
      roomid:roomid,
      username:username,
      socketId: socket.id
    }
    activeusers.push(newuser)
    console.log(activeusers)

    if(!roomid){
      console.log("no room id found")
    }
    socket.join(roomid);
    console.log(`User joined room: ${roomid}`);
  });


  socket.on("message", (input,friendname)=>{
    if(!friendname){
      socket.broadcast.emit("receive",{text:input})
      console.log(input)
    }
    else{
      console.log("entered room")
      console.log('friendname',friendname)
      const user = activeusers.find(user=> user.username === friendname)
      if(!user){
       console.log("no user found")
      }
   
      roomid = user.roomid
      socket.to(roomid).emit("receive",{text:input})
      console.log("message sent",input)
    }
  })
  socket.on('disconnect', () => {
    const disconnectedUser = activeusers.find(user => user.socketId === socket.id);
    console.log("disocnnect user",disconnectedUser)
    if (disconnectedUser) {
      activeusers = activeusers.filter(user => user.socketId !== socket.id);
      console.log(`${disconnectedUser.username} disconnected`);
    }
  });
});

dotenv.config({
    path:"./env"
})
connect()
.then(()=>{
    server.listen(process.env.PORT  ,()=>{
      console.log(`server is running ${process.env.PORT}`)
    })
  })
  .catch((err)=>{
    console.log("mogngo connection eroor",err)
  })