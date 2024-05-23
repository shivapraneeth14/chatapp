import React, { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUsername } from './UserSlice';
function Home() {
const [username,setusername] = useState()
const dispatch = useDispatch();



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
        console.log(response.data.user);
        setusername(response.data.user.username)
        dispatch(addUsername(response.data.user.username));
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);
  return (
    <div>
      Home{username}
    </div>
  )
}

export default Home
