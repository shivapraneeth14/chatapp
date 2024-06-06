import React, { useEffect, useState,useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client';


function Chatbox() {
  const [input ,setinput] = useState()
  const [sentmessage,setsentmessage] = useState([])
  const [messages, setMessages] = useState([]);
  const {id} = useParams()
  const [frineddata,setfrienddata] = useState({}) 
  const{username} = useParams()
  const [roomid,setroomid] = useState()
  const [friendname,setfriendname] = useState()

  const socket = io.connect("http://localhost:8000");

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected to Socket.IO server! ${socket.id}`);
      socket.emit("join_room", roomid,username); 
    });
 
    return () => {
      socket.disconnect(username);
      console.log("dicosnnected")
    };
  }, [roomid]);

   const handleInputChange = (event) => {
    setinput(event.target.value);
    console.log("sending")
   
    
  };
 useEffect(()=>{
  console.log("liogged user",username)
 })
 useEffect(() => {
  socket.on("receive", (message) => {
    console.log("receiving",message);
    if (Array.isArray(messages)) {
      setMessages((prevMessages) => [...prevMessages, message]); 
      console.log("is array array")
      console.log("received message",messages)
    } else {
      setMessages([message]); 
    }
  },[sentmessage]);
});
useEffect(()=>{
  console.log("received message in useffect",messages)
 },[messages])
  useEffect(() => {
    const generateId = () => {
      const numbers = "123456789";
      const length = 6;
      let id = "";
      for (let i = 0; i < length; i++) {
        id += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      console.log(id)
     
      return id
    }
    setroomid(generateId())
  },[])

 useEffect(()=>{
  console.log("rommid",roomid)
 })
 


useEffect(()=>{
  const getuserbyid = async ()=>{
    try {
      const response = await axios.post("http://localhost:8000/api/Userbyid",{id})
      console.log("response",response.data.user)
      setfrienddata(response.data.user)
   
    } catch (error) {
      console.log(error)
    }
  }
  getuserbyid()
},[id])

useEffect(()=>{
  
  console.log("frienddata",frineddata.username)
  setfriendname(frineddata.username)
 },[frineddata])

 const sendMessage = () => {
  if(input.trim() !== ""){
    socket.emit("message", input,friendname);
    console.log("message sent")
    setsentmessage((prevMessages) => [...prevMessages, { text: input }])
    
  }

  
};
useEffect(()=>{
  console.log("sent message",sentmessage)
},[sentmessage])



  return (
    <>
    <div className=' border border-slate-600 rounded-t-xl w-full bg-white py-2'>
    <div className= '  rounded-xl px-4 py-3 h-20'>
    <div className=' flex'>
  <div className='  overflow-hidden w-16 h-16 rounded-full bg-white'>
    <img src={frineddata.profilepicture} alt="" />
  </div>
  <div className=' font-bold ml-3'>{frineddata.username}</div>
  </div>
  </div>
    </div>

   <div className='relative rounded-lg overflow-y-scroll  h-[calc(100vh-270px)] border border-slate-600  bg-white px-1 py-1'>
  {/* <div className= '  border border-b-slate-500 rounded-xl px-4 py-3 h-20'>
    <div className=' flex'>
  <div className='  overflow-hidden w-16 h-16 rounded-full bg-white'>
    <img src={frineddata.profilepicture} alt="" />
  </div>
  <div className=' font-bold ml-3'>{frineddata.username}</div>
  </div>
  </div> */}
 
  <div className=' px-2 py-2  flex'>
    <div className='w-1/2 text-right   h-full   rounded-xl px-3 py-3  '>
      { messages && messages.map((msg)=>(
        <div key={msg.text} className='text-left  left-2 h-6 rounded-xl mb-3 text-black '>
        {msg.text}
      </div>
      ))}
    
    </div>
    <div className='relative w-1/2 h-32 py-2  px-2 text-left rounded-xl bg-white '>
    {sentmessage && sentmessage.length > 0 && sentmessage.map((msg) => (
  <div key={msg.text} className='h-auto text-right overflow-hidden rounded-xl mt-1 mb-3 text-black '>
    {msg.text} 
  </div>
))}
    </div>
    
  </div>
  <div className='absolute bottom-0 w-full h-9'>
    <div className=' flex justify-center'>
        
    </div>
   
  </div>
  
</div>
<div className=' bg-white rounded-b-xl w-full px-2 py-3 flex justify-center'>
  <div className=' w-3/4 rounded-b-xl bg-white flex'>
   <input className='   w-full rounded-xl min-h-5  outline-none border border-slate-500 px-2'
            onChange={handleInputChange} 
        placeholder='Message...'
      
        type="text" />
        <div><button
        onClick={sendMessage}
         className=' bg-white px-1 '>Send</button></div>
         </div>
         </div>

    </>
  )
}

export default Chatbox
