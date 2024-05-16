import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Userprofile() {
    const {username } = useParams()
    const [userdata, setUserData] = useState({});
    const [searchResults, setSearchResults] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [user,setuser] = useState()
  const [loggedinuser,setloggedinuser] = useState()
  const [userid,setuserid] = useState()
  const [friendid,setfriendid]= useState()
  const navigate = useNavigate()

  function getAccessToken() {
    console.log(document.cookie);
    const cookies = document.cookie.split(';');
    console.log(cookies);
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken') {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = getAccessToken();
        console.log('accesstoken:', accessToken);

        if (!accessToken) {
          console.error('Access token not found');
          return;
        }
        const response = await axios.get('http://localhost:8000/api/Profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`, 
          },
        });
        console.log("logged in user",response.data.user);
        setloggedinuser(response.data.user.username)
        setuserid(response.data.user._id)
        console.log("looged in username",loggedinuser)
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

    useEffect(()=>{
        async function getUserDetails (username){
            try {
              console.log("function username",username)
              const response = await axios.post(`http://localhost:8000/api/user/${username}`);
              console.log(response.data.user)
              setUserData(response.data.user)
              setfriendid(response.data.user._id)
            
            } catch (error) {
              console.error("Error fetching user details:", error);
              return null;
            }
          };
          getUserDetails(username);

    },[username])
    function handleusername (username){
        console.log("frontend username",username)
        navigate(`/user/${username}/Userprofile`)
         console.log("sent to the function")
      }
    const search = async () => {
        try {
          const response = await axios.post("http://localhost:8000/api/Search", { searchkey: searchKey });
          const filteredData = response.data.filteredresult;
        console.log(filteredData); 
        setSearchResults(filteredData); 
        } catch (error) {
          console.error("Error searching:", error);
        }
      };
    
      
      useEffect(() => {
        if (searchKey.trim() !== '') {
          search();
        } else {
          setSearchResults([]); 
        }
      }, [searchKey]);
      useEffect(() => {
        console.log(searchResults);
      }, [searchResults]);

   const friendrequest = async ()=>{
     try {
      const response = await axios.post("http://localhost:8000/api/Addfriend",userid,friendid)
      console.log(response)
     } catch (error) {
      console.log("front end friendd request error ",error)
     }
   }
    
  return (
    <>
   <div>
      <div className=' px-9 w-full h-14 bg-black text-white rounded-2xl items-center flex justify-between'>
        <div><Link to="/Home">Logo</Link></div>
        <div>
          <div className=' h-44 relative  top-20 flex flex-col'>
          <input
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
            className=' text-black  w-80 h-7 rounded-xl px-3'
            placeholder='Search People..'
            type="username" />
             <div className=''>  {searchResults && searchResults.map((result, index) => (
          <div onClick={()=>handleusername(result)} className=' text-black bg-white border mt-1 rounded-xl border-black' key={index}>{result}</div>
        ))}
        <div>
          <div>
         
          </div>
        </div>
       </div>
      
          </div>
          
        </div>
        <div className=' flex w-1/3 justify-evenly '>
          <div> <Link to="/Home">Home</Link></div>
          {/* <div> <Link to="Messages">Message</Link></div>
          <div> <Link to="Friends">Friends</Link></div>
          <div><Link to="Profile">Profile</Link></div> */}
        </div>
      </div>

     
      </div>
    <div className=' w-full flex flex-col justify-center '>
      <div className='  mt-8 w-full flex justify-center items-center'>
        <div>
        <div className=' w-28 h-28 bg-gray-800  rounded-full overflow-hidden' >
        <img  className="w-full h-full object-cover" src={userdata.profilepicture} alt="" />
      </div>  
        </div>
        <div className=' ml-4' >
          <div className=' flex w-auto'>
          <div>
        {username !== loggedinuser ?(
          <div>
            <button  onClick={() => friendrequest(userid, friendid)}  className='bg-blue-500 mt-3 text-white px-4 py-2 rounded'>Follow</button>
          </div>
         ):(
          <div>
            <button className='bg-blue-500  font-bold mt-3 text-white px-4 py-2 rounded'>Following</button>
          </div>
         )}
        </div>
        <div>
        <p className=' font-bold ' >{userdata.username}</p> </div>
          </div>
        <h1 className=' text-sm '>{userdata.email}</h1>
      
        </div>
      </div>
      </div>
      </>
  )
}

export default Userprofile
