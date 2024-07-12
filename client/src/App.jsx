import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './views/Register/Register'
import LogIn from './views/Login/Login'
import Home from './views/Home/Home'
import Practice from './views/Practice/Practice'
import Profile from './views/Profile/Profile'
import AIChat from './views/AIChat/Aichat'
import Guide from './views/Guide/Guide'
import HistoryExercises from './views/History/History'
import HistoryExcercisesStudents from './views/HistoryExcercisesStudens.jsx/HistoryExcercisesStudents'
import { ToastContainer } from 'react-toastify'
import './App.css'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/history" element={<HistoryExercises/>}/>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/learn" element={<AIChat/>}/>
          <Route path="/practice" element={<Practice/>}/>
          <Route path="/guide" element={<Guide/>}/>
          <Route path="/historystudents/:id" element={<HistoryExcercisesStudents/>}/>
        </Routes>
        <ToastContainer/>
      </BrowserRouter>
    </div>
  )
}

export default App;