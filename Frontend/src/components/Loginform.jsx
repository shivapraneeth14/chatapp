import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Loginform() {
  const [username,setusername] = useState()
const [loginname,setloginname] = useState()
const[password,setpassword] = useState()
const [profiledata,setprofiledata] = useState({})
const [error,seterror] = useState()
const navigate = useNavigate()

console.log(`${import.meta.env.VITE_FRONTEND_URL}`)
const handlesubmit = async ()=>{
  const user={
    loginname:loginname,
    password:password,
  }
try {
  console.log("sending")
  console.log(`${import.meta.env.VITE_FRONTEND_URL}`)
  console.log(user)
  const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/Login`, user);
  console.log(response.data.loggedinuser.username)
  setusername(response.data.loggedinuser.username)
  console.log(username)
  navigate(`/user/${response.data.loggedinuser.username}`);
} catch (error) {
  console.log("Axios Error:", error);
      if (error.response) {
        console.log("Error Data:", error.response.data);
        console.log(error.response)
        seterror(error.response.data.message)
      } else if (error.request) {
        console.log("Error Request:", error.request);
      } else {
        console.log("Error Message:", error.message);
      }
}
}

  return (
    <div className=' w-screen h-screen flex justify-center align-middle items-center bg-gradient-to-br from-blue-600 to-neutral-300   '>
       <div className=' text-black shadow-slate-900 bg-white pt-5 rounded-e-lg pb-5 px-5 flex flex-col justify-between   max-w-80   min-h-80'>
       <h1 className=' mb-2 font-bold text-black'>Login</h1>
    <div className='  flex justify-between'>
    <input
    onChange={(e)=>setloginname(e.target.value)}
     className=' hover:border-blue-500  outline-blue-900  rounded-lg pl-1'
    placeholder='Username or email'
     type="text" />
    </div>
    <div className='  mt-3 flex justify-between'>
    <input 
    onChange={(e)=>setpassword(e.target.value)}
    className=' border-l-sky-800 rounded-lg pl-1'
    placeholder=' password'
     type="password" />
    </div>
    <div className=' text-black text-sm'>{error}</div>
    <div className=' w-auto h-auto pt-1 pb-1 px-1 bg-blue-600 mt-2'><button onClick={handlesubmit}>Login</button></div>
    <Link to="/Signup"><div className=' text-stone-700 text-sm'>No account? Signup</div></Link>
    <p className=' text-stone-700 text-sm'>Forgot password</p>
</div>
</div>
  )
}

export default Loginform
