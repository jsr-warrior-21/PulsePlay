import React from 'react'
import { useDispatch } from 'react-redux'
import axiosInstance from '../../api/axios'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    
    const logoutHandler = () => {
        axiosInstance.post("/users/logout")
            .then(() => {
                dispatch(logout())
            })
            .catch((err) => console.log("Logout error: ", err))
    }

    return (
        <button
            className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 hover:text-black rounded-full text-white font-medium'
            onClick={logoutHandler}
        >
            Logout
        </button>
    )
}

export default LogoutBtn