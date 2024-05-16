import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Newpassword() {
  const [oldpassword,setoldpassword] = useState()
  const [newpassword,setnewpassword] = useState()
  const navigate = useNavigate()

  const changepasswords = async ()=>{
    console.log(oldpassword)
    console.log(newpassword)
   
    try {
      const response = await axios.post("http://localhost:8000/api/Changepassword",{
        oldpassword: oldpassword,
        newpassword: newpassword
      })
      navigate("/Profile")
      console.log(response)

    } catch (error) {
      console.log("Axios Error:", error);
          if (error.response) {
            console.log("Error Data:", error.response.data);
            console.log(error.response)
          } else if (error.request) {
            console.log("Error Request:", error.request);
          } else {
            console.log("Error Message:", error.message);
          }
      
    }
  }
  
  return (
    <div  className=' flex justify-center items-center  '>
      <div className=' text-white bg-blue-600 pt-5 rounded-e-lg pb-5 px-5 flex flex-col justify-between  items-center max-w-80 h-auto'>
        <div className=' font-bold text-sm'>Reset password</div>
        <input
        className=' mt-2 rounded-lg pl-1'
        placeholder='old password'
         type="password"
         onChange={(e)=>setoldpassword(e.target.value)} />
        <input
        className=' mt-2 rounded-lg pl-1'
        placeholder='new password'
        onChange={(e)=>setnewpassword(e.target.value)}
         type="password" />
         <button onClick={changepasswords} className=' w-auto h-auto pt-1 pb-1 px-1  bg-black mt-2'>Change password</button>
   
      </div>
      
    </div>
  )
}

export default Newpassword
