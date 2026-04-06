import React from 'react'
import { useDispatch } from 'react-redux'
import axiosInstance from '../../api/axios'
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom' // 👈 Navigation ke liye

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate() // 👈 Initialize navigate
    
    const logoutHandler = () => {
        axiosInstance.post("/users/logout")
            .then(() => {
                dispatch(logout()) // Redux saaf hua
                alert("Logout successful!")
                navigate("/login") // 👈 User ko login page par bhejo
                window.location.reload() // 👈 Ye sabse solid tarika hai cache saaf karne ka
            })
            .catch((err) => {
                console.log("Logout error: ", err)
                // Agar session pehle hi expire ho chuka hai, toh bhi logout kar do
                dispatch(logout())
                navigate("/login")
            })
    }

    return (
        <button
            className='inline-block px-6 py-2 duration-200 hover:bg-red-600 hover:text-white rounded-full text-white font-medium bg-red-500/20'
            onClick={logoutHandler}
        >
            Logout
        </button>
    )
}

export default LogoutBtn