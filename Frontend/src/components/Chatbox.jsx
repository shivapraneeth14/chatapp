import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faMicrophone,faSquare } from '@fortawesome/free-solid-svg-icons'


function Chatbox() {
  const [sendedmessage,setsendedmessage] = useState([])
  const [receivedmessage,setreceivedmessage] = useState([])
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
  const [audioblb,setaudioblb] = useState()
  const [textbox,settextbox] = useState(false);
  const [userid,setuserid] = useState()

  useEffect(() => {
    const getuserid = async () => {
      if (!username) {
        console.error("Username is not defined",);
        return;
      }
      try {
      console.log("fecthed username",username)

        const response = await axios.post("http://localhost:8000/api/getuseridbyname", {
         username: username 
        });
        console.log("User ID:", response.data.userid);
        setuserid(response.data.userid)
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
  
    if (username) {  
      getuserid();
    }
  }, [username]);

  useEffect(()=>{
    const getmessages = async ()=>{
      try {
        const response = await axios.post("http://localhost:8000/api/getmessages", { userid:userid, friendid:id });
        console.log("recived messages",response.data.receivedchat);
        console.log("sended messages",response.data.sendedmessage);
        const combined = [
          ...response.data.receivedchat.map(message => ({ ...message, type: 'incoming' })),
          ...response.data.sendedmessage.map(message => ({ ...message, type: 'sent' }))
        ];

        combined.sort((a, b) => new Date(a.time) - new Date(b.time));

        setCombinedMessages(combined);

      } catch (error) {
        console.log("unable to fecth meessages",error)
      }
    };
    getmessages()
  },[id,userid])

 


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
        setaudioblb(audioBlob)
        console.log("audioBlob", audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
     
      // const cleanedurl  = audioUrl.replace("blob:","")
      // console.log("after audio blob",cleanedurl)
      
        setaudiurl(audioUrl)
       
        
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

 const sendMessage = async() => {
  if (input !== "" || audiourl !== "") {
    const timestamp = Date.now()
    if(input){
      socket.emit("message", input, friendname,"","",userid,id);
      setsentmessage((prevMessages) => [...prevMessages, { text: input, type: 'sent',timestamp }]);
    }
    if(audiourl){
      
      const formData = new FormData();
      formData.append('audio', audioblb, 'audio.wav');
      const response = await axios.post("http://localhost:8000/api/Transcript", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    const { transcription, fileUrl } = response.data;
      console.log("whiles ending audio urll  kkkk" ,audiourl);
      socket.emit("message","", friendname, audiourl,transcription,userid,id);
      

      setsentaudio((audio) => [...audio, {audiourl,type:'sent',timestamp,
        audiotext:transcription}]);
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
    // URL.revokeObjectURL(audiourl);
    setaudiurl("")
    setaudioblb("")
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

const texts =()=>{
  settextbox((prev)=> !prev);
}



  return (
    <>
    <div className=' w-full h-auto  border border-slate-600 rounded-t-xl  bg-white py-2'>
    <div className= '  rounded-xl px-4 py-3 h-20'>
    <div className=' flex '>
  <div className='  overflow-hidden w-16 h-16 rounded-full bg-white'>
    <img src={frineddata.profilepicture} alt="" />
  </div>
  <div className=' font-bold ml-3'>{frineddata.username}</div>
  </div>
  </div>
    </div>

   <div className='  relative rounded-lg overflow-y-scroll  h-[calc(100vh-270px)] border border-slate-600  bg-white px-1 py-1'>

 
  <div className=' px-2 py-2   flex flex-col'>
  <div className='w-full px-2 py-2 mb-2 rounded-xl  h-auto'>
  {combinedMessages.map((msg, index) => (
  <div 
    key={index} 
    className={`w-full flex ${msg.type  === 'incoming' ? 'justify-start' : 'justify-end'} mb-2`}
  >
    <div  className={`max-w-fit rounded-xl h-auto px-2 py-2 ${msg.type === 'incoming' ? 'bg-blue-500 text-left' : 'border border-slate-500 bg-white text-right'}`}
    >
    {msg.text && <div className=' min-w-fit'>{msg.text}</div>}
    {msg.audiourl && (
     
  <div className=' flex flex-col'>
    {textbox ? (
  <div>
    <div className=' w-auto h-auto'>
    {msg.audiotext}</div>
    <div onClick={texts}><FontAwesomeIcon icon={faEye}/></div>
  </div>
) : (
  <div>
    <div className=' w-auto h-auto '><audio controls src={msg.audiourl}></audio></div>
    <div onClick={texts}><FontAwesomeIcon icon={faEye}/></div>
  </div>
)}

    
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
