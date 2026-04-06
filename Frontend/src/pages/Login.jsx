import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login as authLogin } from '../store/authSlice'
import axiosInstance from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "", username: "" })
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const res = await axiosInstance.post("/users/login", formData) // #2
            if (res.data.success) {
                dispatch(authLogin(res.data.data.user))
                navigate("/")
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login fail ho gaya bhai!")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#0f0f0f]">
            <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
                <p className="text-gray-500 mb-8">Login to PulsePlay to start streaming</p>
                
                {error && <p className="text-red-500 bg-red-500/10 p-3 rounded-lg mb-6 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" placeholder="Username or Email" 
                        className="w-full bg-[#121212] border border-gray-800 p-4 rounded-xl focus:border-blue-600 outline-none transition"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input 
                        type="password" placeholder="Password" 
                        className="w-full bg-[#121212] border border-gray-800 p-4 rounded-xl focus:border-blue-600 outline-none transition"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg mt-4 shadow-lg transition">Login</button>
                </form>
                <p className="mt-6 text-gray-500 text-sm">new user<Link to="/signup" className="text-blue-500 hover:underline">create account</Link></p>
            </div>
        </div>
    )
}

export default Login