import React from 'react'
import { useParams } from 'react-router-dom'
import Chatbox from './Chatbox'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
function Messages() {
  const {username} = useParams()
  const [userid,setuserid]= useState()
  const [followingdetails,setfollowingdetails] = useState([])
  const navigate = useNavigate()
  useEffect(()=>{
    const getuserid = async()=>{
      try {
         const response = await axios.post("http://localhost:8000/api/Getuserid",{username})
         console.log(response.data.user._id)
         setuserid(response.data.user._id)
      }
    catch (error) {
      console.log(error)
    }
    }
    getuserid()
  },[username])
  useEffect(()=>{
    const getfriends = async()=>{
      try {
        const response = await axios.post("http://localhost:8000/api/friends",{userid})
        console.log(response) 
        const frienddetails = response.data.userfriends
        console.log(frienddetails)
        const followers = frienddetails.map((detail)=>detail.Followers)
        console.log(followers)
        const following = frienddetails.map((detail)=>detail.Following[0])
        console.log("following",following)
        const followingdetail = following.map((detai)=> detai.Followingdetails[0])
        console.log("following details",followingdetail[0])
        setfollowingdetails(followingdetail)
        console.log(followingdetails)

      } catch (error) {
        console.log(error)  
      }
    }
    getfriends()
  },[userid])
  useEffect(()=>{
    console.log("followingdetails",followingdetails)
  },[followingdetails])
  const move =(id)=>{
   navigate(`${id}`)
  }
  return (
    <div>
     <div className=' flex justify-evenly px-4 py-4 '>
      <div className='h-[calc(100vh-120px)] rounded-lg border border-slate-600  mb-4 min-w-64'>
        <div className=' '>
        <div className=' relative  px-4 py-2 border border-b-slate-500 w-full h-20'>
          <div className=' w-full text-left  relative left-0 font-bold text-xl'>{username}</div>
          <div className=' w-full text-center'>Messages</div>
        </div>
        <div className=''>
        <div className=' border px-3   w-full h-16'>
          
        {followingdetails && followingdetails.map((detail, index) => (
           <div onClick={()=>move(detail._id)} key={index} className=' flex justify-evenly '>
                  <div key={index} className='w-14 h-14 bg-white overflow-hidden rounded-full'>
                    <img src={detail.profilepicture} alt="" />
                  </div>
                     <div className='w-64 px-3 text-left '>{detail.username}</div>
            </div>
             ))}
             </div>
        </div>
        </div>
       
      </div>
      <div className=' h-[calc(100vh-120px)] px-2  rounded-lg  bg-red-500 w-2/3'>
        
       <Outlet/>
       
        
        {/* <div className=' flex  justify-center items-center'>
          <div className=' w-56 h-56 bg-yellow-500'>hello</div>
        </div> */}
      </div>
     </div>
    </div>
  )
}

export default Messages
