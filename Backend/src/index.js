import dotenv from "dotenv";
import connect from "./db/index.js";
import app from "./app.js"; 
import { Server } from "socket.io";
import { createServer } from "http";
import http from 'http';  
import { AssemblyAI } from 'assemblyai';
import Chat from "./Models/Chat.model.js";

dotenv.config({ path: "./env" });

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `${process.env.BACKEND_URL}`, 
    methods: ["GET", "POST"],
  },
});

let activeusers = [];
let roomid;

let isDatabaseConnected = false;

io.on('connection', (socket) => {
  console.log(`Socket ID: ${socket.id}`);
  
  socket.on("join_room", (roomid, username) => {
    console.log("Join room:", roomid, username);
    const newuser = { roomid, username, socketId: socket.id };
    activeusers.push(newuser);
    console.log(activeusers);

    if (!roomid) {
      console.log("No room ID found");
    }
    socket.join(roomid);
    console.log(`User joined room: ${roomid}`);
  });

  socket.on("message", async (input, friendname, audiourl, transcriptText, userid, id) => {
    if (!friendname) {
      socket.broadcast.emit("receive", { text: input }, audiourl);
      console.log(input, audiourl);
    } else {
      console.log("Entered room:", friendname);
      
      const user = activeusers.find(user => user.username === friendname);
      
      if (!user) {
        const chat = new Chat({
          sender: userid,
          receiver: id,
          text: input,
          audiourl,
          audiotext: transcriptText,
        });
        console.log("Chat saved:", chat);
        if (!chat) {
          res.status(400).json({ message: "Chat not saved" });
        }

        await chat.save();
        return;
      }
  
      const room_id = user.roomid;
      
      if (audiourl) {
        socket.to(room_id).emit('receive', '', audiourl, transcriptText);
      }
      
      if (input) {
        socket.to(room_id).emit("receive", input);
        console.log("Message sent:", input);
      }
    }
  });

  socket.on('disconnect', () => {
    const disconnectedUser = activeusers.find(user => user.socketId === socket.id);
    console.log("Disconnect user:", disconnectedUser);
    if (disconnectedUser) {
      activeusers = activeusers.filter(user => user.socketId !== socket.id);
      console.log(`${disconnectedUser.username} disconnected`);
    }
  });
});
app.get('/', (req, res) => {
  res.send('Hello, world!');
});
if (!isDatabaseConnected) {
  connect()
    .then(() => {
      isDatabaseConnected = true;
      server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
        console.log(`Backend URL: ${process.env.BACKEND_URL}`);
      });
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
}
