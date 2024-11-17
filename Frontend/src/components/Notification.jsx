import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Notification() {
  const [userid, setuserid] = useState();
  const { username } = useParams();
  const [followerid, setfollowerid] = useState();
  const [followerdata, setfollowerdata] = useState();
  const [frienddocid, setfrienddocid] = useState();

  useEffect(() => {
    const getuserid = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/Getuserid`, { username });
        console.log(response.data.user._id);
        setuserid(response.data.user._id);
      } catch (error) {
        console.log(error);
      }
    };
    getuserid();
  }, [username]);

  useEffect(() => {
    const notify = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/Notifications`, { userid });
        console.log('front end response', response.data);
        const data = response.data;
        const id = data.map((data) => data._id);
        const followerid = data.map((data) => data.Following);
        console.log('id', id[0]);
        console.log('follower id', followerid);
        setfrienddocid(id[0]);
        setfollowerid(followerid[0]);
      } catch (error) {
        console.log(error);
      }
    };
    notify();
  }, [userid]);

  useEffect(() => {
    const getfollowerid = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/Getuserid`, { followerid });
        console.log('follower id data', response.data.user);
        setfollowerdata(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getfollowerid();
  }, [followerid]);

  const acceptrequest = async () => {
    console.log('accepting request', frienddocid);
    try {
      const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/Acceptfriend`, { frienddocid });
      console.log(response);
      console.log('accepted request');
    } catch (error) {
      console.log(error);
    }
  };

  const deleterequest = async () => {
    console.log('deleting request');
    try {
      const response = await axios.post(`${import.meta.env.VITE_FRONTEND_URL}/api/Declinefriend`, { frienddocid });
      console.log(response);
      console.log('request deleted');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex justify-center mt-10'>
      <div className='border border-gray-300 px-6 py-4 w-72 rounded-lg bg-white shadow-lg'>
        {followerdata ? (
          <div className='text-center'>
            <p className='text-lg font-semibold text-gray-800'>
              You have a friend request from{' '}
              <span className='text-blue-600 font-bold'>{followerdata.username}</span>
            </p>
            <div className='mt-4 flex justify-evenly'>
              <button
                onClick={acceptrequest}
                className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300'>
                Accept
              </button>
              <button
                onClick={deleterequest}
                className='border border-gray-400 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300'>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p className='text-center text-gray-600'>No notifications at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default Notification;
