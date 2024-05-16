import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Loginform'
import Signup from './components/Signup'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import Notification from './components/Notification'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div  >
     <Header/>
     <Notification/>
     <Outlet/>
     </div>
    
    </>
  )
}

export default App
