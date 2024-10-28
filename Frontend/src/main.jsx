import React from 'react';
import ReactDOM from 'react-dom/client'
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Loginform from './components/Loginform.jsx';
import Signup from './components/Signup.jsx';
import Profile from './components/Profile.jsx';
import Home from './components/Home.jsx';
import Messages from './components/Messages.jsx';
import Friends from './components/Friends.jsx';
import Userprofile from './components/Userprofile.jsx';
import Chatbox from './components/Chatbox.jsx';
import App from './App';
import { Provider } from 'react-redux';
import Shop from './components/Shop.jsx';
import { store } from './components/Store.js';
import ReelsPage from './components/ReelsPage.jsx';

// import process from 'process';
// import path from 'path-browserify';

// import { Buffer } from 'safe-buffer';



// window.Buffer = Buffer
// window.process = process;
// window.path = path;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Loginform />,
  },
  {
    path: '/user/:username',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'Profile',
        element: <Profile />,
       
      },
      {
        path: 'Messages',
        element: <Messages />,
        children:[
         {
          path:":id",
          element:<Chatbox/>
         }
        ]
      },
      {
        path: 'Friends',
        element: <Friends />,
      },
      {
        path: 'userprofile/:profilename',
        element: <Userprofile />,
      },
      {
        path:'Store',
        element:<Shop/>,
        // loader:{iscasualstore:true}
      },
      {
        path:'Reels',
        element:<ReelsPage/>
      }
      
    ],
  },
  {
    path: '/Signup',
    element: <Signup />,
  },
 
 
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);