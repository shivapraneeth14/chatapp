import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notification from './Notification';
import { useSelector } from 'react-redux';


function Header() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const loggedinuser = useSelector(state => state.user.username);
 
  

  const search = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/Search", { searchkey: searchKey });
      const filteredData = response.data.filteredresult;
      console.log("filtered data",filteredData); 
      setSearchResults(response.data.filteredresult); 
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleUsername = (profilename) => {
    console.log("loggedinuser",loggedinuser)
    console.log("frontend username", profilename);
    navigate(`userprofile/${profilename}`);
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

  const toggleNotification = () => {
    console.log(active)
    setActive(!active);
  };

  return (
    <div className='px-4 md:px-9 w-full h-14 bg-black text-white  rounded-2xl flex items-center justify-between'>
      <div className='text-lg md:text-xl'>
        <Link to="">Logo</Link>
      </div>
      <div className='relative flex items-center'>
        <input
          onChange={(e) => setSearchKey(e.target.value)}
          value={searchKey}
          className='text-black w-60 max-sm:w-12 h-7 rounded-xl px-3'
          placeholder='Search People...'
          type="text"
        />
        <div className='absolute top-8 mt-1 w-full'>
          {searchResults && searchResults.map((result, index) => (
            <div
              onClick={() => handleUsername(result)}
              className='text-black bg-white border rounded-xl border-black p-2 cursor-pointer'
              key={index}
            >
              {result}
            </div>
          ))}
        </div>
      </div>
      <div className='max-sm:w-1/4 flex w-1/3 justify-evenly text-sm relative'>
        <div><Link to="">Home</Link></div>
        <div><Link to="Messages">Messages</Link></div>
        <div><Link to="Friends">Friends</Link></div>
        <div><Link to="Profile">Profile</Link></div>
        <div className=' cursor-default' onClick={toggleNotification}>Notification</div>
       
          {active && (
        <div className=' absolute top-8 right-0'>
         <Notification />
           </div>
          )}
       
      </div>
    </div>
  );
}

export default Header;

