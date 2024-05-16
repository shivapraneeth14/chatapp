import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function Profile() {
  const [userdata, setUserData] = useState({});
  const navigate = useNavigate();
  const [profilepic,setprofilepic]= useState()
  const [profilepicurl,setprofilepicurl] = useState()
  const [loggedinuser,setloggedinuser] = useState()
    

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
  const logoutprofile = () => {
    console.log("before"); 
    const response = axios.get('http://localhost:8000/api/Logout')
    console.log(response)
        response.then(() => {
            console.log("after"); 
            navigate("/");
            console.log(response)
        })
        .catch(error => {
            console.log(error);
        });
};

    
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
        console.log(response.data.user);
        setUserData(response.data.user);
        setloggedinuser(response.data.user.username)
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);
  
  const uploadprofilepic = async () => {
    const formData = new FormData();
    formData.append('profilepic', profilepic);
  
    try {
      const fileSizeInKB = profilepic.size / 1024; 
      console.log("File size:", fileSizeInKB, "KB"); 
  
      const response = await axios.post('http://localhost:8000/api/Profilepic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log("response", response);
      const imageurl = response.data.imageurl;
      console.log("image url", imageurl);
      setprofilepicurl(imageurl);
    } catch (error) {
      console.log("Axios Error:", error);
      if (error.response) {
        console.log("Error Data:", error.response.data);
        console.log(error.response);
      } else if (error.request) {
        console.log("Error Request:", error.request);
      } else {
        console.log("Error Message:", error.message);
      }
    }
  }
  
  useEffect(()=>{
    console.log("profilepic",profilepic)
  },[profilepic])
 
  return (
    <>
    <div className=' w-full flex flex-col justify-center '>
      <div className='  mt-8 w-full flex justify-center items-center'>
      <div>
      <div className=' w-28 h-28 bg-gray-800  rounded-full overflow-hidden' >
        <img  className="w-full h-full object-cover" src={userdata.profilepicture} alt="" />
      </div>
      <div>
        <div>
      <button onClick={() => document.getElementById('fileupload').click()} className=' text-4xl'  >+</button></div>
      </div>
      <div>
        <button onClick={uploadprofilepic}><h5 className=' bg-neutral-600 rounded-2xl px-3 py-1 text-white text-sm '>Change Photo</h5></button></div>
      </div>
      <div className=' ml-5'>
      <div className=' flex justify-center '>
        </div>
        <div className=' flex items-center justify-evenly'>
        <p className=' font-bold ' >{userdata.username}</p>         
        </div>
       
      <h1 className=' text-sm '>{userdata.email}</h1>
      <input 
     onChange={(e) => setprofilepic(e.target.files[0])}
     name="profilepic"
      id='fileupload'
      type="file"
      accept='video/*,image/*'style={{ display: 'none' }}/>
      <div className=' mt-4 flex justify-evenly'>
        
      
      <button className=' text-white bg-blue-700 font-bold rounded-xl px-1 py-1' onClick={logoutprofile}>Logout</button>
      <button  className=' ml-4 text-white bg-blue-700 font-bold rounded-xl px-1 py-1'>
      <Link to="Newpassword"><div className=' text-white text-sm'>Change password</div></Link></button>

      </div>
      </div>
      </div>
      </div>
      <div className=' relative top-3 flex justify-center items-center'>
      <Outlet/>
      </div>
      

    </>
  );
}

export  default  Profile;


