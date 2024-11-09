import React from 'react'
import { useParams, Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

function Messages() {
  const { username } = useParams()
  const [userid, setuserid] = useState()
  const [followingdetails, setfollowingdetails] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getuserid = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/Getuserid", { username })
        setuserid(response.data.user._id)
        console.log('user id',response.data.user._id);
      } catch (error) {
        console.log(error)
      }
    }
    getuserid()
  }, [username])

  useEffect(() => {
    const getfriends = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/friends", { userid:userid })
        console.log("sent userid",userid);
        console.log("response for frined",response)
        const frienddetails = response.data.userfriends
        const following = frienddetails.map((detail) => detail.Following[0])
        const followingdetail = following.map((detai) => detai.Followingdetails[0])
        setfollowingdetails(followingdetail)
      } catch (error) {
        console.log(error)
      }
    }
    getfriends()
  }, [userid])

  const move = (id) => {
    navigate(`${id}`)
  }

  return (
    <div className="h-screen flex justify-evenly items-start px-4 py-2 bg-gray-100">
   
      <div className="h-[calc(100vh-60px)] rounded-lg border border-slate-300 shadow-lg bg-white min-w-64 w-1/4">
        <div>
          <div className="relative px-4 py-3 border-b border-slate-200 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <div className="text-left font-bold text-2xl">{username}</div>
            <div className="text-center font-semibold">Messages</div>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
            {followingdetails && followingdetails.map((detail, index) => (
              <div key={index} onClick={() => move(detail._id)} className="flex items-center py-2 px-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
                <div className="w-14 h-14 rounded-full overflow-hidden shadow-md">
                  <img className="w-full h-full object-cover" src={detail.profilepicture} alt="" />
                </div>
                <div className="w-64 px-4 text-gray-700 font-semibold text-lg">{detail.username}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[calc(100vh-60px)] px-2 rounded-lg w-full bg-white shadow-lg">
        <Outlet />
      </div>
    </div>
  )
}

export default Messages
