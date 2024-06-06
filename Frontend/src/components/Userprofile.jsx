import React from 'react'
import {  useParams } from 'react-router-dom';
import { useEffect,useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';
function Userprofile() {
  const {username,profilename} = useParams()
  const [Userdata,setUserData]= useState()
  const[friendid,setFriendid] = useState()
  const [ userid,setuserid] = useState()
  const [status,setstatus] = useState(false)
  const [frienddocid,setfrienddocid] = useState()
  const [friendstatus,setfriendstatus] = useState()
  const [followingstatus,setfollowing] = useState(false)
  const [deletemutualfollow,setdeletemutulafollow] = useState(false)
  const [addfollowback,setaddfollowback] = useState(false)

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
  const checkfriend = async ()=>{
    try {
      const response = await axios.post("http://localhost:8000/api/Checkfriend",{userid,friendid})
      console.log(response)
      console.log("resp",response.data.isFriend)
      setfriendstatus(response.data.isFriend)
      console.log(friendstatus)
    } catch (error) {
      console.log(error)
    }
  }
  checkfriend()
})

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

// useEffect(()=>{
//   if(!followingstatus){
//     Declinerequest()
//   }
//   else{
//     friendRequest()
//   }

// },[])
const mutualfollow = ()=>{
  setdeletemutulafollow((prev)=>!prev)
}
useEffect(()=>{
  if(setdeletemutulafollow){
   delfollowing()
  }
},[deletemutualfollow])
const delfollowing = async()=>{
  try {
    const response = await axios.post("http://localhost:8000/api/Deletemutualfollowing",{userid:userid,
      friendid:friendid
    })
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}
const changefollowingstatus = ()=>{
  setfollowing(!followingstatus)
}
useEffect(()=>{
  if(followingstatus){
    delfollowing()
  }
},[followingstatus])

const changeaddfollowback = ()=>{
  setaddfollowback((prev)=>!prev)
}
useEffect(()=>{
  if(addfollowback){
   folback()
  }
},[addfollowback])
const folback = async()=>{
  try {
    const response = await axios.post("http://localhost:8000/api/Followback",{userid:userid,
    friendid:friendid
  })
  console.log(response)
  } catch (error) {
    console
    .log(error)
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
                   
                        <div className='  w-64  flex flex-col mt-5'>
                        <div>
                            <p className=' ml font-bold'>{Userdata.username}</p>
                        </div>
                        

                        
                        {friendstatus === "mutualfollowing" ? ( 
                          
                        <div>{console.log("insisde status",friendstatus)}
                    <button onClick={mutualfollow}  className={` border border-black text-black px-1 py-1 rounded ${status ? 'bg-white' : 'bg-blue-500'}`}>
                      {deletemutualfollow ? 'Followback' : 'Following'}
                    </button>
                    <button className='  flex justify-evenly'>Message</button>
                    </div>
                  ) : friendstatus === "following" ? (
                     <div className='  flex justify-evenly '>
                    <button onClick={changefollowingstatus} className={` border border-black text-black bg-blue-500 px-1 py-1 rounded`}>
                      {followingstatus ? 'Follow' : 'Following'}
                    </button>
                    <Link to={`/user/${username}/Messages`}>
                    <button className=' text-white rounded-lg  h-10 px-1 py-1  bg-black' >Message</button>
                    </Link>
                    </div>
                  ) : friendstatus === "followback" ? (
                    <button onClick={changeaddfollowback}  className={` border border-black text-black bg-blue-500 px-1 py-1 rounded`}>
                      {addfollowback ? 'Following' : 'Followback'}
                    </button>
                  ):
                  username === profilename ? (
                    <button className='bg-blue-500 font-bold mt-3 border border-black text-black px-1 py-1 rounded'>Following</button>
                  ) : (
                    <button onClick={changestatus}  className={` border border-black text-black px-1 py-1 rounded ${status ? 'bg-white' : 'bg-blue-500'}`}>
                      {status ? 'Sent' : 'Follow'}
                    </button>
                  )
                  }
                            {/* {username !== profilename ? (
                               <button onClick={changestatus} className='bg-blue-500 mt-3 text-white px-4 py-2 rounded'>
                               {status ? 'Sent' : 'Follow'}
                           </button>
                            ) : (
                                <button className='bg-blue-500 font-bold mt-3 text-white px-4 py-2 rounded'>Following</button>
                            )} */}
                        </div>
                      
                    </div>
                    <h1 className='text-sm  '>{Userdata.email}</h1>
                </div>
            </div>
        </div>)}
        
    </div>
</>
  )
}

export default Userprofile

