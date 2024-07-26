import dotenv from "dotenv"
import connect from "./db/index.js";
import app from "./app.js";
import {Server} from "socket.io"
import {createServer} from "http"
import http from 'http';  
import { AssemblyAI } from 'assemblyai'

const server = http.createServer(app);
// const client = new AssemblyAI({
//   apiKey: process.env.ASSLEMBLY_API_KET
// });


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


  socket.on("message", async (input, friendname, audiourl,transcriptText) => {
    
    
    if (!friendname) {
      socket.broadcast.emit("receive", { text: input }, audiourl);
      console.log(input);
      console.log(audiourl);
    } else {
      console.log("entered room");
      console.log('friendname', friendname);
      
      const user = activeusers.find(user => user.username === friendname);
      
      if (!user) {
        console.error("No user found for friendname:", friendname);
        throw new Error(`User with username ${friendname} not found`);
      }
  
      const room_id = user.roomid;
      
      
      if (audiourl) {
        // const cleanedUrl = audiourl.replace('blob:', '');
        // console.log('Cleaned URL:', cleanedUrl);
        
        socket.to(room_id).emit('receive', '', audiourl, transcriptText);

        // try {
        //   const transcript = await client.transcripts.transcribe({ audio_url: cleanedUrl });
        //   const transcriptText = transcript.text;
        //   if(transcriptText === null){
        //     console.log("error in transcipted text",transcript.error)
        //   }
        //   console.log('Backend audio URL:', audiourl);
        //   console.log('Transcript text:', transcriptText);
        // } catch (error) {
        //   console.error('Error during transcription:', error);
        // }
      }
      
      if (input) {
        socket.to(room_id).emit("receive",  input );
        console.log("message sent", input);
      }
    }
  });
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