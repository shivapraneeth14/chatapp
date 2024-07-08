import React, { useEffect, useState,useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChainSlash, faMicrophone,faSquare } from '@fortawesome/free-solid-svg-icons'
import { text } from '@fortawesome/fontawesome-svg-core';


function Chatbox() {
  const [combinedMessages,setCombinedMessages] = useState([])
  const [input ,setinput] = useState()
  const [sentmessage,setsentmessage] = useState([])
  const [messages, setMessages] = useState([]);
  const {id} = useParams()
  const [frineddata,setfrienddata] = useState({}) 
  const{username} = useParams()
  const [roomid,setroomid] = useState()
  const [friendname,setfriendname] = useState()
  const [record,setrecord] = useState(false)
  const [audiochunks, setAudioChunks] = useState([]);
  const [audiorecorder, setAudiorecorder] = useState(null);
  const [audiourl,setaudiurl] = useState()
  const [sentaudio,setsentaudio]= useState([])
  const [incomingaudio,setincomingaudio] = useState([])

  const startrecording = async () => {
    
    console.log("started recording");
    const record = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log(record);
    const recorder = new MediaRecorder(record);
    let chunks = [];
    console.log("beofre recording ",chunks);
    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
      console.log("after recording ",chunks)
    };
    recorder.start();
    setAudioChunks(chunks);
    console.log("on record audio chunks",audiochunks)

    setAudiorecorder(recorder);
   
  };

  const stoprecording = () => {
    if (audiorecorder) {
      audiorecorder.onstop = () => {
      console.log("on stop audion shunks",audiochunks)
        console.log("stopped recording");
        const audioBlob = new Blob(audiochunks, { type: 'audio/wav' });
        console.log("audioBlob", audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
      URL.revokeObjectURL(audioUrl);
      const cleanedurl  = audioUrl.replace("blob:","")
      console.log("after audio blob",cleanedurl)
      
        setaudiurl(cleanedurl)
        console.log("after audio blob",cleanedurl)
       
        
      };
      audiorecorder.stop();
      
    } else {
      console.error("audiorecorder is not defined");
    }
  };

  const socket = io.connect("http://localhost:8000");
useEffect(()=>{
  if(record){
 startrecording()
   }else{
stoprecording()
   }
},[record])
  const changerecord=()=>{
    setrecord((prev)=> !prev)
  }
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
  socket.on("receive", (message,audiourl,audiotext) => {
    console.log("receiving",message,audiourl,audiotext);
    const timestamp = Date.now()
    if (Array.isArray(messages)) {
      if(message){
       
        setMessages((prevMessages) => [...prevMessages, { text: message, type: 'incoming',timestamp }]);
      } 
      if(audiourl){

        setincomingaudio((audio)=>[...audio,{audiourl,type:"incoming",timestamp,audiotext}])
      }
      console.log("is array array")
      console.log("received message",messages)
      console.log(audiourl)
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
  if (input !== "" || audiourl !== "") {
    const timestamp = Date.now()
    if(input){
      socket.emit("message", input, friendname);
      setsentmessage((prevMessages) => [...prevMessages, { text: input, type: 'sent',timestamp }]);
    }
    if(audiourl){
      console.log("whiles ending audio urll  kkkk" ,audiourl);
      socket.emit("message","", friendname, audiourl);
      setsentaudio((audio) => [...audio, {audiourl,type:'sent',timestamp}]);
    }
    // if (input && audiourl) {
 
    //   setsentaudio((audio) => [...audio, audiourl]);
    // } else if (input) {
    //   socket.emit("message", input, friendname);
    //   setsentmessage((prevMessages) => [...prevMessages, { text: input }]);
    // } else if (audiourl) {
    //   socket.emit("message","", friendname, audiourl);
    //   setsentaudio((audio) => [...audio, audiourl]);
    // }

    console.log("sending audio url", audiourl);
    console.log("message sent");
    setinput("")
    setaudiurl("")
    
  }
};
useEffect(()=>{
  console.log("sent message",sentmessage)
  console.log("sent audio ",sentaudio)
},[sentmessage.sentaudio])

useEffect(() => {
  const combined = [];
  const maxLength = Math.max(messages.length, sentmessage.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < sentmessage.length) {
      console.log("sent message in combined", sentmessage[i]);
      combined.push(sentmessage[i]);
    }
    if (i < messages.length) {
      console.log("received message in combined", messages[i]);
      combined.push(messages[i]);
    }
    if(i < incomingaudio.length){
      console.log("received audio in combined",incomingaudio)
      combined.push(incomingaudio[i])
    }
    if( i< sentaudio.length){
      console.log("sent audio in combined ",sentaudio)
      combined.push(sentaudio[i])
    }

  }
  const recombined = combined.sort((a, b) => a.timestamp - b.timestamp)

  setCombinedMessages(recombined);
}, [sentmessage, messages,incomingaudio,sentaudio]);

useEffect(()=>{
  console.log("combined messages",combinedMessages)
  console.log("sentmessage.",sentmessage)
  console.log("recived messaged",messages)
},[combinedMessages,messages,sentmessage])




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

 
  <div className=' px-2 py-2   flex flex-col'>
  <div className='w-full px-2 py-2 mb-2 rounded-xl  h-auto'>
  {combinedMessages.map((msg, index,audio) => (
  <div 
    key={index} 
    className={`w-full flex ${msg.type  === 'incoming' ? 'justify-start' : 'justify-end'} mb-2`}
  >
    <div  className={`max-w-fit rounded-xl h-auto px-2 py-2 ${msg.type === 'incoming' ? 'bg-blue-500 text-left' : 'border border-slate-500 bg-white text-right'}`}
    >
    {msg.text && <div>{msg.text}</div>}
{msg.audiourl && (
  <div>
    <audio controls src={msg.audiourl}></audio>
  </div>
)}
  
    
     </div>

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
         <div>{ record ? ( 
          <div onClick={changerecord} className=' rounded-full  shadow-md shadow-slate-700 w-6 h-6  text-blue-500'><FontAwesomeIcon icon={faSquare}/></div>
        
        ):(
          <div onClick={changerecord} className=' rounded-full  shadow-md shadow-slate-700 w-6 h-6  text-blue-500'><FontAwesomeIcon icon={faMicrophone}/></div>)}
      </div>
         {/* <div className=' rounded-full  shadow-md shadow-slate-700 w-6 h-6  text-blue-500'><FontAwesomeIcon icon={faMicrophone}/></div>
          <div className=' rounded-full  shadow-md shadow-slate-700 w-6 h-6  text-blue-500'><FontAwesomeIcon icon={faSquare}/></div> */}
         </div>
         </div>

    </>
  )
}

export default Chatbox
