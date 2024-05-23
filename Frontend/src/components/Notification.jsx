import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function Notification() {
  const [userid,setuserid] = useState()
  const {username} = useParams()
  const [followerid,setfollowerid] = useState()
  const [followerdata,setfollowerdata] = useState()
  const [requestid,setrequestid] = useState()
  const [notificationid,setnotificationid] = useState()
  const [frienddocid,setfrienddocid] = useState()
 
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
    const notify= async()=>{
      try {
        const response = await axios.post("http://localhost:8000/api/Notifications",{userid})
        console.log("front end response",response.data)
        const data = response.data 
        const id = data.map((data)=>data._id)
        const followerid = data.map((data)=>data.Following)
        console.log("id",id[0])
        console.log("fol id",followerid)
        setfrienddocid(id[0])
        setfollowerid(followerid[0])
        if (response.data.length === 0) {
          console.log('No unread notifications found.');
        } else {
          console.log('Unread Notifications:', response.data);
        }
      } catch (error) {
        console.log(error)
      }
    }
    notify()
    },[userid,followerid,requestid])

    useEffect(()=>{
      const getfollowerid = async()=>{
        
        try {
           const response = await axios.post("http://localhost:8000/api/Getuserid",{followerid})
           console.log("follower id data",response.data.user)
           setfollowerdata(response.data.user)
        }
      catch (error) {
        console.log(error)
      }
      }
      getfollowerid()
    },[followerid])

    const acceptrequest = async()=>{
      console.log("acceptoing request",notificationid)
      try {
        const response = await axios.post("http://localhost:8000/api/Acceptfriend",{frienddocid})
        console.log(response)
        console.log("accepted request")
       
      } catch (error) {
        console.log(error)
      }
    }

    const deleterequest = async ()=>{
      console.log("deleting request")
      try {
        const response = await axios.post("http://localhost:8000/api/Declinefriend",{frienddocid})
        console.log(response)
        console.log("request deleted")
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className=''>
      <div className=' border border-gray-700  px-2 py-2  w-64 rounded-xl  bg-white  min-h-16'>
      {followerdata ? (
          <div>
            <div className='text-black'>
              you have a friend request from <div className='font-bold'>{followerdata.username}</div>
            </div>
            <div className='flex justify-evenly'>
              <button onClick={acceptrequest} className='bg-blue-800 px-1 rounded-xl py-1 text-black'>Accept</button>
              <button onClick={deleterequest} className='border border-gray-700 bg-white px-1 rounded-xl py-1 text-black'>Delete</button>
            </div>
          </div>
        ) : (
          <div className=' text-black' >No notification</div>
        )}
      </div>
    </div>
  )
}

export default Notification
