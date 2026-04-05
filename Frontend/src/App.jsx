import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axiosInstance from './api/axios'
import { login, logout } from './store/authSlice'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    // Backend se current user mango
    axiosInstance.get("/users/current-user")
    .then((res) => {
      if (res.data) {
        dispatch(login(res.data.data))
      } else {
        dispatch(logout())
      }
    })
    .catch(() => dispatch(logout()))
    .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        {/* Yahan aapka Header aayega */}
        <main>
          {/* Outlet matlab routes ke hisaab se page change hoga */}
          <Outlet />
        </main>
        {/* Yahan aapka Footer aayega */}
      </div>
    </div>
  ) : null
}

export default App