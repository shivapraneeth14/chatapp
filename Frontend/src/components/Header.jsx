import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notification from './Notification';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMessage, faBell, faUserGroup, faUser, faShop } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const loggedinuser = useSelector((state) => state.user.username);

  const search = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/Search`, { searchkey: searchKey });
      const filteredData = response.data.filteredresult;
      setSearchResults(filteredData);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleUsername = (profilename) => {
    navigate(`userprofile/${profilename}`);
  };

  useEffect(() => {
    if (searchKey.trim() !== '') {
      search();
    } else {
      setSearchResults([]);
    }
  }, [searchKey]);

  const toggleNotification = () => {
    setActive(!active);
  };

  return (
    <div className='w-screen h-14 px-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg rounded-2xl flex items-center justify-between flex-wrap'>
      <div className='text-xl font-bold'>
        <Link to="">BrandLogo</Link>
      </div>
      
      <div className='relative flex items-center'>
        <input
          onChange={(e) => setSearchKey(e.target.value)}
          value={searchKey}
          className='text-black max-w-60 h-8 rounded-full px-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
          placeholder='Search People...'
          type='text'
        />
        <div className='absolute top-10 mt-1 w-full z-50'>
          {searchResults && searchResults.map((result, index) => (
            <div
              onClick={() => handleUsername(result)}
              className='text-black bg-white border rounded-xl border-gray-300 p-2 cursor-pointer hover:bg-gray-100 shadow-sm'
              key={index}
            >
              {result}
            </div>
          ))}
        </div>
      </div>

      <div className='flex space-x-6'>
       
        <Link to="" className='flex items-center text-gray-300 hover:text-white'>
          <FontAwesomeIcon icon={faHome} className='mr-2' />
          <span className='hidden sm:inline'>Home</span>
        </Link>

        <Link to="Messages" className='flex items-center text-gray-300 hover:text-white'>
          <FontAwesomeIcon icon={faMessage} className='mr-2' />
          <span className='hidden sm:inline'>Messages</span>
        </Link>

        <Link to="Friends" className='flex items-center text-gray-300 hover:text-white'>
          <FontAwesomeIcon icon={faUserGroup} className='mr-2' />
          <span className='hidden sm:inline'>Friends</span>
        </Link>

        <Link to="Store" className='flex items-center text-gray-300 hover:text-white'>
          <FontAwesomeIcon icon={faShop} className='mr-2' />
          <span className='hidden sm:inline'>Shop</span>
        </Link>

        <Link to="Profile" className='flex items-center text-gray-300 hover:text-white'>
          <FontAwesomeIcon icon={faUser} className='mr-2' />
          <span className='hidden sm:inline'>Profile</span>
        </Link>

        <div
          className='relative flex items-center text-gray-300 hover:text-white cursor-pointer'
          onClick={toggleNotification}
        >
          <FontAwesomeIcon icon={faBell} />
          {active && (
            <div className='absolute top-12 right-0 bg-white text-black rounded-lg shadow-lg p-4 w-64 z-50'>
              <Notification />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;

