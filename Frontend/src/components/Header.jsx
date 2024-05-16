import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function Header() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [user,setuser] = useState()
  const navigate = useNavigate()

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

 function handleusername (username){
    console.log("frontend username",username)
    navigate(`/user/${username}/Userprofile`)
     getUserDetails(username)
     console.log("sent to the function")
  }
  
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
  return (
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
        ))}</div>
          </div>
          
        </div>
        <div className=' flex w-1/3 justify-evenly '>
          <div> <Link to="/Home">Home</Link></div>
          <div> <Link to="Messages">Message</Link></div>
          <div> <Link to="Friends">Friends</Link></div>
          <div><Link to="Profile">Profile</Link></div>
          <div>Notfication</div>
        </div>
      </div>

     
      </div>
  );
}

export default Header;

