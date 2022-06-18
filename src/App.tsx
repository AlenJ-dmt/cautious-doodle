import './App.css'
import { Sidebar } from './Sidebar'
import { Chat } from "./Chat"
import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";
import { Login } from "./Login"
import { useState } from "react"
import { useStateValue } from './StateProvider';


function App() {
  const [{ user }, dispatch] = useStateValue()
  const auth = localStorage.getItem("USER_ID")
  return (
    <div className="App">
      {!auth || auth.length === 0 ? <Login /> :

        <div className="app__body">
          <Sidebar />
          <Routes >
            <Route path='/' element={<Link to={"/rooms/50OkbmJUkuWtIH2KJTiA"}>Room</Link>} />

            <Route path='/rooms/:roomId' element={<Chat />} />

          </Routes>
        </div>

      }
    </div>
  )
}

export default App
