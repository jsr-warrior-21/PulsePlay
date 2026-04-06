import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice'
import axiosInstance from './api/axios'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const location = useLocation() // Route change detect karne ke liye

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosInstance.get("/users/current-user")
        if (res.data?.success) {
          dispatch(login(res.data.data))
        } else {
          dispatch(logout())
        }
      } catch (error) {
        dispatch(logout())
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [dispatch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (loading) {
    return (
      <div className="h-screen bg-[#0f0f0f] flex flex-col items-center justify-center">
        <div className="text-3xl font-black tracking-tighter text-white animate-bounce">
          <span className="bg-red-600 px-3 py-1 rounded-xl mr-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]">P</span>
          PulsePlay
        </div>
        <p className="text-gray-500 mt-4 text-sm font-mono tracking-widest uppercase">Connecting to backend...</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col">
      <Header />

      <div className="flex flex-1 pt-16"> 
        <Sidebar />

        <main className="flex-1 transition-all duration-300 md:ml-64 w-full">
          <div className="p-4 md:p-8 max-w-[1800px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App