import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import './Home.css';
import { useNavigate } from 'react-router-dom'

function Signup() {
  const[username,setusername] = useState()
  const [email,setemail] = useState()
  const [password,setpassword] = useState()
  const navigate = useNavigate()
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: username,
      email: email,
      password: password,
    };
    console.log("sending", user);
  
    try {
      console.log("sent");
      const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/register`, user);
      console.log(response.data);
      console.log("read");
      navigate("/")
    } catch (error) {
      console.log("Axios Error:", error);
      if (error.response) {
        console.log("Error Data:", error.response.data);
      } else if (error.request) {
        console.log("Error Request:", error.request);
      } else {
        console.log("Error Message:", error.message);
      }
    }
  };
  return (
    <div className=' w-screen h-screen  bg-gradient-to-br from-blue-600 flex  justify-evenly items-center'>
      <div className='w-96 rounded-lg bg-cover custom-size h-auto bg-black'>

       <img className='  ' src="..\public\Image\Sign.jpg" alt="Sign with text" />

</div>
    <div className=' text-black bg-white pt-5 rounded-lg pb-5 px-5 flex flex-col justify-between  items-center w-auto min-h-80'>
    <h1 className=' mb-2 font-bold text-black'>Signup</h1>
    <div className='  flex justify-between'>
   
    <input className=' rounded-lg pl-1'
    onChange={(e)=>setusername(e.target.value)}
    placeholder='Username'
     type="text" />
    </div>
    <div className='  mt-2 flex justify-between'>

    <input className='outline-sky-800 rounded-lg pl-1'
    onChange={(e)=>setemail(e.target.value)}
    placeholder=' Email'
    type="text" />
    </div>
    <div className=' mt-2 flex justify-between'>
    
    <input className=' outline-sky-800 rounded-lg pl-1'
    onChange={(e)=>setpassword(e.target.value)}
    placeholder=' password'
     type="password" />
    </div>
    <div className=' w-auto h-auto pt-2 pb-1 px-2 rounded-md bg-blue-600 mt-2'><button className=' ' onClick={handleSubmit}>Signup</button></div>
    <Link to="/"><div  className=' text-stone-700 text-sm'>Login</div></Link>
   
</div>
</div>
  )
}

export default Signup
