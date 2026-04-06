import React from 'react'
import { useDispatch } from 'react-redux'
import axiosInstance from '../../api/axios'
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const logoutHandler = () => {
        axiosInstance.post("/users/logout")
            .then(() => {
                dispatch(logout())
                navigate("/login")
            })
            .catch((err) => console.log("Logout error: ", err))
    }

    return (
        <button
            onClick={logoutHandler}
            className='px-4 py-2 bg-red-600 rounded-full text-sm font-bold'
        >
            Logout
        </button>
    )
}

export default LogoutBtn