import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice'
import axiosInstance from './api/axios'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const location = useLocation()

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
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="text-3xl font-black tracking-tighter text-white animate-bounce italic">
          <span className="bg-blue-600 px-3 py-1 rounded-xl mr-2 shadow-[0_0_15px_rgba(37,99,235,0.5)]">P</span>
          PulsePlay
        </div>
        <p className="text-zinc-500 mt-4 text-xs font-black tracking-widest uppercase italic">Connecting to Pulse...</p>
      </div>
    )
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white flex flex-col overflow-x-hidden selection:bg-blue-600/30">
      <Header />

     
      <div className="flex flex-1 pt-16 md:pt-20"> 
        <Sidebar />

         
        <main className="flex-1 transition-all duration-300 lg:ml-64 w-full pb-20 lg:pb-0">
          <div className="max-w-[1800px] mx-auto h-full px-0 sm:px-4">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}

export default App