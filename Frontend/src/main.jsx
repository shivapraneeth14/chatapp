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
import Newpassword from './components/Newpassword.jsx';
import Userprofile from './components/Userprofile.jsx';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './components/Store';
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
        children: [
          {
            path: 'Newpassword',
            element: <Newpassword />,
          },
        ],
      },
      {
        path: 'Messages',
        element: <Messages />,
      },
      {
        path: 'Friends',
        element: <Friends />,
      },
      {
        path: 'userprofile/:profilename',
        element: <Userprofile />,
      },
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