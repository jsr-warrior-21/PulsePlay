import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axiosInstance from './api/axios'
import { login, logout } from './store/authSlice'
import { Header, Footer } from './components'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    // Page load hote hi check karo user logged in hai ya nahi
    axiosInstance.get("/users/current-user")
      .then((res) => {
        if (res.data) {
          dispatch(login(res.data.data))
        } else {
          dispatch(logout())
        }
      })
      .catch(() => {
        // Agar error aaye (mtlb token expire ya logged out), toh logout kar do
        dispatch(logout())
      })
      .finally(() => setLoading(false))
  }, [dispatch])

  // Jab tak loading chal rahi hai, screen par loading dikhao
  return !loading ? (
    <div className='min-h-screen flex flex-col bg-gray-900'>
      <Header />
      <main className='flex-grow'>
        {/* Outlet hi wo jagah hai jahan Home, Login, Signup pages render honge */}
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <div className='h-screen w-full flex items-center justify-center bg-gray-900'>
      <h1 className='text-white text-2xl font-bold italic animate-pulse'>
        PulsePlay is Loading...
      </h1>
    </div>
  )
}

export default App