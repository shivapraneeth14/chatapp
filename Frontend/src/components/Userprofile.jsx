import React from 'react'
import {  useParams } from 'react-router-dom';
import { useEffect,useState } from 'react';
import axios from 'axios'
function Userprofile() {
  const {username,profilename} = useParams()
  const [Userdata,setUserData]= useState()
  const[friendid,setFriendid] = useState()
  const [ userid,setuserid] = useState()
  const [status,setstatus] = useState(false)
  const [frienddocid,setfrienddocid] = useState()

  useEffect(()=>{
    const fetchUserProfile = async ()=>{
      console.log("username ",username)
      try {
        const response = await axios.get('http://localhost:8000/api/Profile', {
          params: { username } 
      });
          console.log("logged in user data",response.data.user)
          setuserid(response.data.user._id);
          console.log(userid)

      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    fetchUserProfile();
  },[username])
  
const changestatus = ()=>{
  setstatus(!status)
}

  useEffect(() => {
    async function getUserDetails(profilename) {

console.log("function in user ", username);
        console.log("function in user ", profilename);
        try {
            const response = await axios.post(`http://localhost:8000/api/${username}/user/${profilename}`);
            console.log("profile data",response.data.user)
            setUserData(response.data.user);
            setFriendid(response.data.user._id);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }
    getUserDetails(profilename);
}, [username, profilename]);

useEffect(()=>{
  if(status){
    friendRequest()
  }
  else{
    Declinerequest()
  }
},[status])

const friendRequest = async () => {
  console.log("userid",userid,friendid)
    try {
        const response = await axios.post('http://localhost:8000/api/Addfriend', {
          userid, 
          friendid
        });
        console.log("request response",response);
        setfrienddocid(response.data.frienddocid)
    } catch (error) {
        console.log('Front end friend request error:', error);
    }
};
const Declinerequest = async ()=>{

      try {
         const response  = await axios.post('http://localhost:8000/api/Declinefriend',{frienddocid})
         console.log(response)
         console.log("delledt request")
         } catch (error) {
         
          console.log(error)
  
         }
}

  return (
    <>
           
    <div>
      {Userdata && (<div className='w-full flex flex-col justify-center'>
            <div className='mt-8 w-full flex justify-center items-center'>
                <div>
                    <div className='w-28 h-28 bg-gray-800 rounded-full overflow-hidden'>
                        <img className="w-full h-full object-cover" src={Userdata.profilepicture} alt="" />
                    </div>
                </div>
                <div className='ml-4'>
                    <div className='flex w-auto'>
                        <div>
                            {username !== profilename ? (
                               <button onClick={changestatus} className='bg-blue-500 mt-3 text-white px-4 py-2 rounded'>
                               {status ? 'Sent' : 'Follow'}
                           </button>
                            ) : (
                                <button className='bg-blue-500 font-bold mt-3 text-white px-4 py-2 rounded'>Following</button>
                            )}
                        </div>
                        <div>
                            <p className='font-bold'>{Userdata.username}</p>
                        </div>
                    </div>
                    <h1 className='text-sm'>{Userdata.email}</h1>
                </div>
            </div>
        </div>)}
        
    </div>
</>
  )
}

export default Userprofile

