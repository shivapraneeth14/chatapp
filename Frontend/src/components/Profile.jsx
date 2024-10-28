import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { useNavigate, Link, Outlet, useParams } from 'react-router-dom';


function Profile() {
  const [userdata, setUserData] = useState({});
  const navigate = useNavigate();
  const [profilepic, setprofilepic] = useState();
  const [profilepicurl, setprofilepicurl] = useState();
  const [loggedinuser, setloggedinuser] = useState();
  const { username } = useParams();
  const [store, setstore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userid,setuserid] = useState()
  const [storeDetails, setStoreDetails] = useState({
    email: '',
    storeName: '',
    description: ''
  });

  const logoutprofile = () => {
    axios.get('http://localhost:8000/api/Logout')
      .then(() => {
        navigate("/");
      })
      .catch(error => {
        console.log(error);
      });
  };
 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/Profile', { params: { username } });
        setUserData(response.data.user);
        setloggedinuser(response.data.user.username);
        setuserid(response.data.user._id);
        setstore(response.data.user.store);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, [username]);

  const uploadprofilepic = async () => {
    const formData = new FormData();
    formData.append('profilepic', profilepic);

    try {
      const response = await axios.post('http://localhost:8000/api/Profilepic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setprofilepicurl(response.data.imageurl);
    } catch (error) {
      console.log("Axios Error:", error);
    }
  };

  const handleInputChange = (e) => {
    setStoreDetails({
      ...storeDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitStoreDetails = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/createstore', {
        ...storeDetails,
        owner: loggedinuser 
      });
      console.log(response.data);
      setShowModal(false); 
      setstore(true);
    } catch (error) {
      console.log('Error creating store:', error);
    }
  };

  const createStore = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const navigation=()=>{
    navigate(`/user/${username}/Store`)
  }

  return (
    <div className="w-full flex flex-col items-center mt-8">
      <div className="w-full flex justify-center items-center">
        <div className="w-72 p-6 bg-white shadow-lg rounded-3xl flex flex-col items-center">
          
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4">
            <img 
              className="w-full h-full object-cover" 
              src={userdata.profilepicture || 'default-profile.png'} 
              alt="Profile" 
            />
          </div>

          <p className="text-lg font-semibold">{userdata.username}</p>
          <h1 className="text-sm text-gray-500 mb-4">{userdata.email}</h1>

          <div className="flex space-x-4 mb-4">
            <button 
              className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition" 
              onClick={uploadprofilepic}
            >
              Change Photo
            </button>
            <button 
              className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={logoutprofile}
            >
              Logout
            </button>
          </div>

          <Link to="Newpassword" className="text-blue-600 text-sm underline">
            Change Password
          </Link>

          {store ? (
             
           <Link 
            to={`/user/${username}/Store`}
            state={{ isUserStore: true }}
           className="mt-4 text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition">My Store</Link>
          //   <button onClick={navigation}   className="mt-4 text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
          //  > My Store</button>
             
           
          ) : (
            <button 
              className="mt-4 text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              onClick={createStore}
            >
              Create Your Store
            </button>
          )}
        </div>
      </div>

      <div className="relative top-6 flex justify-center items-center">
       
      </div>

      {/* Modal for creating a store */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl" 
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Create Your Store</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                name="email" 
                value={storeDetails.email} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Store Name</label>
              <input 
                type="text" 
                name="storeName" 
                value={storeDetails.storeName} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter store name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                name="description" 
                value={storeDetails.description} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Describe your store"
              />
            </div>
            <button 
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" 
              onClick={handleSubmitStoreDetails}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;







// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// axios.defaults.withCredentials = true;
// import { useNavigate } from 'react-router-dom';
// import { Link, Outlet, useParams } from 'react-router-dom';

// function Profile() {
//   const [userdata, setUserData] = useState({});
//   const navigate = useNavigate();
//   const [profilepic, setProfilePic] = useState();
//   const [profilepicurl, setProfilePicUrl] = useState();
//   const [loggedinuser, setLoggedinUser] = useState();
//   const { username } = useParams();  
//   function getAccessToken() {
//     const cookies = document.cookie.split(';');
//     for (const cookie of cookies) {
//       const [name, value] = cookie.trim().split('=');
//       if (name === 'accessToken') {
//         return decodeURIComponent(value);
//       }
//     }
//     return null;
//   }

//   const logoutProfile = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8000/api/${username}/Logout`);
//       navigate("/");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const accessToken = getAccessToken();
//         if (!accessToken) {
//           console.error('Access token not found');
//           return;
//         }
//         const response = await axios.get(`http://localhost:8000/api/${username}/Profile`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`, 
//           },
//         });
//         setUserData(response.data.user);
//         setLoggedinUser(response.data.user.username);
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//       }
//     };
//     fetchUserProfile();
//   }, [username]);

//   const uploadProfilePic = async () => {
//     const formData = new FormData();
//     formData.append('profilepic', profilepic);

//     try {
//       const response = await axios.post(`http://localhost:8000/api/${username}/Profilepic`, formData, {
//         headers: {
//           Authorization: `Bearer ${getAccessToken()}`,  // Include Authorization header
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       setProfilePicUrl(response.data.imageurl);
//     } catch (error) {
//       console.log("Axios Error:", error);
//       if (error.response) {
//         console.log("Error Data:", error.response.data);
//       } else if (error.request) {
//         console.log("Error Request:", error.request);
//       } else {
//         console.log("Error Message:", error.message);
//       }
//     }
//   };

//   useEffect(() => {
//     console.log("profilepic", profilepic);
//   }, [profilepic]);

//   return (
//     <>
//       <div className='w-full flex flex-col justify-center'>
//         <div className='mt-8 w-full flex justify-center items-center'>
//           <div>
//             <div className='w-28 h-28 bg-gray-800 rounded-full overflow-hidden'>
//               <img className="w-full h-full object-cover" src={userdata.profilepicture} alt="" />
//             </div>
//             <div>
//               <button onClick={() => document.getElementById('fileupload').click()} className='text-4xl'>+</button>
//             </div>
//             <div>
//               <button onClick={uploadProfilePic}>
//                 <h5 className='bg-neutral-600 rounded-2xl px-3 py-1 text-white text-sm'>Change Photo</h5>
//               </button>
//             </div>
//           </div>
//           <div className='ml-5'>
//             <div className='flex justify-center'></div>
//             <div className='flex items-center justify-evenly'>
//               <p className='font-bold'>{userdata.username}</p>
//             </div>
//             <h1 className='text-sm'>{userdata.email}</h1>
//             <input 
//               onChange={(e) => setProfilePic(e.target.files[0])}
//               name="profilepic"
//               id='fileupload'
//               type="file"
//               accept='video/*,image/*' style={{ display: 'none' }} />
//             <div className='mt-4 flex justify-evenly'>
//               <button className='text-white bg-blue-700 font-bold rounded-xl px-1 py-1' onClick={logoutProfile}>Logout</button>
//               <button className='ml-4 text-white bg-blue-700 font-bold rounded-xl px-1 py-1'>
//                 <Link to="Newpassword"><div className='text-white text-sm'>Change password</div></Link>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className='relative top-3 flex justify-center items-center'>
//         <Outlet />
//       </div>
//     </>
//   );
// }

// export default Profile;


