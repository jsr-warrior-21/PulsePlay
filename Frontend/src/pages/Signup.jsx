import React, { useState } from 'react'
import axiosInstance from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'

function Signup() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: ""
    })
    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Form Data isliye kyunki humein files upload karni hain
        const data = new FormData()
        data.append("fullName", formData.fullName)
        data.append("email", formData.email)
        data.append("username", formData.username)
        data.append("password", formData.password)
        data.append("avatar", avatar)
        if (coverImage) data.append("coverImage", coverImage)

        try {
            const res = await axiosInstance.post("/users/register", data) // Endpoint #1
            if (res.data.success) {
                alert("Registration Successful! Now Login.")
                navigate("/login")
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration fail ho gaya!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#0f0f0f] py-10 px-4">
            <div className="w-full max-w-lg bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                <h2 className="text-3xl font-black text-white mb-2 text-left">Create Account</h2>
                <p className="text-gray-500 mb-8 text-left">Join PulsePlay and start sharing your videos</p>

                {error && <p className="text-red-500 bg-red-500/10 p-3 rounded-lg mb-6 text-sm text-left">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" placeholder="Full Name" 
                            className="w-full bg-[#121212] border border-gray-800 p-3.5 rounded-xl focus:border-blue-600 outline-none transition"
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            required
                        />
                        <input 
                            type="text" placeholder="Username" 
                            className="w-full bg-[#121212] border border-gray-800 p-3.5 rounded-xl focus:border-blue-600 outline-none transition"
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    </div>
                    
                    <input 
                        type="email" placeholder="Email Address" 
                        className="w-full bg-[#121212] border border-gray-800 p-3.5 rounded-xl focus:border-blue-600 outline-none transition"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    
                    <input 
                        type="password" placeholder="Password" 
                        className="w-full bg-[#121212] border border-gray-800 p-3.5 rounded-xl focus:border-blue-600 outline-none transition"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Avatar (Profile Picture)*</label>
                        <input 
                            type="file" accept="image/*" 
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            onChange={(e) => setAvatar(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Cover Image (Optional)</label>
                        <input 
                            type="file" accept="image/*" 
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#272727] file:text-white hover:file:bg-[#3f3f3f]"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg mt-4 shadow-lg transition disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>
                
                <p className="mt-6 text-gray-500 text-sm text-left">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline font-bold">Login here</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup