import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Layout from './components/Layout'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/dashboard" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
