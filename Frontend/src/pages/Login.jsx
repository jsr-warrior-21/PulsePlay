import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login as authLogin } from '../store/authSlice'
import axiosInstance from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const res = await axiosInstance.post("/users/login", formData)
            if (res.data.success) {
                dispatch(authLogin(res.data.data.user))
                navigate("/")
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. check your credentials.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#050505] p-4">
            <div className="w-full max-w-[440px] bg-zinc-900/30 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full"></div>
                
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-blue-600 p-3 rounded-2xl mb-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                        <Zap size={28} fill="white" className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter italic">Welcome back</h2>
                    <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] mt-2">Login to your pulse account</p>
                </div>
                
                {error && (
                    <div className="flex items-center gap-3 text-red-400 bg-red-400/5 border border-red-400/10 p-4 rounded-2xl mb-8 text-xs font-bold leading-tight">
                        <AlertCircle size={16} className="shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-600 ml-2 tracking-widest">Credentials</label>
                        <div className="relative group">
                            <Mail size={18} className="absolute left-4 top-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Username or email" 
                                className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl focus:border-blue-600/50 outline-none transition-all text-sm font-medium text-white placeholder:text-zinc-700"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-2">
                            <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Security</label>
                            <Link to="#" className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-400 tracking-tighter">Forgot?</Link>
                        </div>
                        <div className="relative group">
                            <Lock size={18} className="absolute left-4 top-4 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                className="w-full bg-black/40 border border-white/5 p-4 pl-12 rounded-2xl focus:border-blue-600/50 outline-none transition-all text-sm font-medium text-white placeholder:text-zinc-700"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-white text-black hover:bg-zinc-200 py-4.5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] mt-4 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : (
                            <>
                                Login <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-zinc-500 text-[11px] font-black tracking-widest uppercase italic">
                        New to pulse? <Link to="/signup" className="text-blue-500 hover:text-blue-400 ml-1">Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login