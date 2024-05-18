import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Loginform from './components/Loginform.jsx';
import Signup from './components/Signup.jsx';
import Profile from './components/Profile.jsx';
import Home from './components/Home.jsx';
import Messages from './components/Messages.jsx';
import Friends from './components/Friends.jsx';
import Newpassword from './components/Newpassword.jsx'
import Userprofile from './components/Userprofile.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Loginform />,
  },
  {
    path: `/user/:username`,
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "Profile", 
        element: <Profile/>,
        children:[
          {
            path:"Newpassword", 
            element:<Newpassword/>
          }
        ]
        
      },
      {
        path:"Messages",
        element:<Messages/>
      },
      {
        path:"Friends",
        element:<Friends/>
      },
    ]
  },
  {
    path: "/Signup",
    element: <Signup />
  },
  {
    path: "/user/:username/Userprofile",
    element: <Userprofile />,
  }
 
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <RouterProvider router={router} />
</React.StrictMode>
)