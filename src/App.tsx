import './App.css'
import { Sidebar } from './Sidebar'
import { Chat } from "./Chat"
import { Routes, Route, Link } from "react-router-dom";
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
          <Routes>
            {/* <Route path='/rooms/50OkbmJUkuWtIH2KJTiA' element={<h1>Home Page</h1>} /> */}

            <Route path='/rooms/:roomId' element={<Chat />} />

          </Routes>
        </div>}
    </div>
  )
}

export default App
