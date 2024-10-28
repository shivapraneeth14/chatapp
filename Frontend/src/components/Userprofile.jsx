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
  const [followerscount,setfollowersocunt] = useState(0)
  const [followingcount,setfollowingcount] = useState(0)
  const [hastore,sethasstore] = useState(false)

  

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
            sethasstore(response.data.user.store);
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
useEffect(()=>{
  const getfollowerscount = async()=>{
   try {
     const response = await axios.post("http://localhost:8000/api/Followersocount",{profilename})
     console.log("followercount",response.data.count[0].
     FollowerCount)
     setfollowersocunt(response.data.count[0].
      FollowerCount)
   } catch (error) {
    console.log(error)
   }
  }
  getfollowerscount()
},[profilename])

useEffect(()=>{
  const getfollowingcount = async ()=>{
    try {
      const response = await axios.post("http://localhost:8000/api/Followingcount",{profilename})
      console.log("following coount",response.data.count[0].
      FollowingCount)
      setfollowingcount(response.data.count[0].
        FollowingCount)
    } catch (error) {
      console.log(error)
    }
  }
  getfollowingcount()
},[profilename]
)
  return (
    <>
    {Userdata && (<div className=' flex flex-col px-3 py-3 justify-center items-center'>
     <div className=' w-full flex justify-center  h-1/2 '>
      <div className=' bg-white  w-96   flex h-auto px-3 py-3'>
      <div className=' w-auto  h-auto'>
          <div className=' w-32 h-32 overflow-hidden rounded-full bg-white'>
          <img className="w-full h-full object-cover" src={Userdata.profilepicture} alt="" />
          </div>
        </div>
            <div className='flex flex-col justify-center align-middle w-full  h-auto'>
              <div className=' w-full flex text-xl px-6 py-3 text-left h-1/2 font-bold'>{Userdata.username}</div>
              <div> {friendstatus === "mutualfollowing" ? ( 
                          
                          <div className=' flex justify-center'>{console.log("insisde status",friendstatus)}
                      <button onClick={mutualfollow}  className={` border border-black text-black px-1 py-1 rounded ${status ? 'bg-white' : 'bg-blue-500'}`}>
                        {deletemutualfollow ? 'Followback' : 'Following'}
                      </button>
                      <Link to={`/user/${username}/Messages`}>
                      <button className=' border border-black text-black px-1 py-1 rounded bg-blue-500 ml-3 flex justify-evenly'>Message</button>
                      </Link>
                      </div>
                    ) : friendstatus === "following" ? (
                       <div className='  flex justify-center w-auto h-auto bg-red-800 '>
                      <button onClick={changefollowingstatus} className={` border border-black text-black bg-blue-500 px-1 py-1 rounded`}>
                        {followingstatus ? 'Follow' : 'Following'}
                      </button>
                      <Link to={`/user/${username}/Messages`}>
                      <button className='border border-black text-black px-1 py-1 rounded bg-blue-500 ml-3 flex justify-evenly' >Message</button>
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
                    }</div>
              <div className=' mt-3 w-full h-1/2'>
                <div  className=' flex justify-evenly'>
                 
                  <div className=' flex'>
                  <h5  className='  text-slate-800 mr-2 ' >{followingcount}</h5>
              <h1 className=' text-slate-800'>Following</h1>
                  </div>
                  <div className=' flex'>
                  <h5  className='  text-slate-800  mr-2' >{followerscount}</h5><h1 className=' text-slate-800 '>Followers</h1>
              
                  </div>
                </div>
              </div>
              {hastore && (
                <div>
                <Link 
                to={`/user/${username}/Store`}
                state={{ Storebelongto:friendid }}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-all duration-300 ease-in-out'>
                Store</Link>
                {/* <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-all duration-300 ease-in-out">
                  Store
                </button> */}
              </div>
              )}
            </div>
      </div>
  
     </div>
    
     <div className=' w-full  h-1/2'></div>
      </div> 

    )}
          
    {/* <div>
      {Userdata && (
      <div className='w-full flex flex-col justify-center'>
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
                            
                        </div>
                      
                    </div>
                    <h1 className='text-sm  '>{Userdata.email}</h1>
                </div>
            </div>
        </div>
      )}
        
    </div> */}
</>
  )
}

export default Userprofile