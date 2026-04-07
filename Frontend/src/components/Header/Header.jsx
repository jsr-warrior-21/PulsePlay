import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance, { getSecureUrl } from '../../api/axios'
import LogoutBtn from './LogoutBtn'
// Premium Icons
import { Bell, Search, Plus, X, CheckCheck, Trash2, Zap } from 'lucide-react'

function Header() {
    const { status, userData } = useSelector((state) => state.auth)
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [showNotif, setShowNotif] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`)
    }

    useEffect(() => {
        if (status) {
            const getCount = () => {
                axiosInstance.get("/notifications").then(res => {
                    setUnreadCount(res.data.data.unreadCount || 0)
                })
            }
            getCount();
            const interval = setInterval(getCount, 30000); 
            return () => clearInterval(interval);
        }
    }, [status])

    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get("/notifications")
            setNotifications(res.data.data.notifications)
            setShowNotif(!showNotif)
        } catch (err) { console.error(err) }
    }

    const handleMarkAsRead = async (id) => {
        try {
            await axiosInstance.patch(`/notifications/read/${id}`)
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) { console.error(err) }
    }

    const handleClearAll = async () => {
        try {
            await axiosInstance.patch("/notifications/read-all")
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (err) { console.error(err) }
    }

    const handleDeleteNotif = async (e, id) => {
        e.stopPropagation() 
        try {
            await axiosInstance.delete(`/notifications/${id}`)
            setNotifications(prev => prev.filter(n => n._id !== id))
            const target = notifications.find(n => n._id === id)
            if (target && !target.isRead) setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) { console.error("Delete failed", err) }
    }

    const getNotificationMessage = (n) => {
        const sender = n.fromUser?.username || "Someone";
        switch (n.type) {
            case "video_like": return `${sender} liked your video`;
            case "comment": return `${sender} commented on your video`;
            case "subscription": return `${sender} subscribed to your channel`;
            case "comment_like": return `${sender} liked your comment`;
            default: return `${sender} interacted with your content`;
        }
    }

    return (
        <header className='h-20 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 fixed top-0 left-0 w-full z-[100] px-4 md:px-8 flex items-center justify-between gap-4'>
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            
            {/* Logo Section */}
            <Link to='/' className='flex items-center gap-2 group'>
                <div className='bg-blue-600 p-1.5 rounded-xl group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all'>
                    <Zap size={20} fill="white" className="text-white" />
                </div>
                <span className='text-xl font-black text-white tracking-tighter italic uppercase hidden sm:block'>PulsePlay</span>
            </Link>

            {/* Search Bar - Responsive */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
                <div className="relative group">
                    <input 
                        type="text"
                        className="w-full bg-[#121212] border border-white/5 rounded-2xl py-2.5 px-5 pl-12 outline-none focus:border-blue-500/50 focus:bg-[#181818] transition-all text-sm font-medium text-white placeholder:text-zinc-600"
                        placeholder="Search creators, videos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-2.5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                </div>
            </form>
            
            {/* Action Section */}
            <div className='flex items-center gap-3 md:gap-6'>
                {status ? (
                    <div className='flex items-center gap-4 md:gap-6 relative'>
                        
                        {/* Notification Bell */}
                        <button onClick={fetchNotifications} className={`p-2 rounded-xl transition-all hover:bg-white/5 relative ${unreadCount > 0 ? "text-blue-500" : "text-zinc-400"}`}>
                            <Bell size={22} strokeWidth={2} />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotif && (
                            <div className="absolute top-14 right-0 w-[320px] md:w-[380px] bg-[#121212] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 z-[110] animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="font-black text-white uppercase italic tracking-widest text-xs">Feed</h3>
                                    {notifications.length > 0 && (
                                        <button onClick={handleClearAll} className="flex items-center gap-1 text-[10px] text-blue-500 font-black uppercase tracking-tighter hover:text-blue-400 transition-colors">
                                            <CheckCheck size={12} /> Mark all
                                        </button>
                                    )}
                                </div>
                                
                                <div className="space-y-2 max-h-[450px] overflow-y-auto no-scrollbar">
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <div key={n._id} className={`group relative p-3 rounded-2xl cursor-pointer flex gap-3 items-center transition-all border border-transparent ${!n.isRead ? "bg-blue-600/5 border-blue-500/20" : "hover:bg-white/5"}`} onClick={() => handleMarkAsRead(n._id)}>
                                            <img src={getSecureUrl(n.fromUser?.avatar)} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
                                            <div className="flex-1 min-w-0 pr-6">
                                                <p className={`${!n.isRead ? "text-white font-bold" : "text-zinc-500"} text-[11px] leading-tight`}>{getNotificationMessage(n)}</p>
                                                <span className="text-[9px] text-zinc-600 mt-1 block font-black uppercase tracking-widest">{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                            <button onClick={(e) => handleDeleteNotif(e, n._id)} className="opacity-0 group-hover:opacity-100 absolute right-3 text-zinc-600 hover:text-red-500 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )) : <div className='py-10 text-center'><p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">Quiet for now</p></div>}
                                </div>
                            </div>
                        )}

                        {/* Create Button - Fixed for Mobile (+) */}
                        <Link 
                            to='/add-video' 
                            className='flex items-center justify-center gap-2 bg-white text-black p-2.5 sm:px-5 sm:py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-lg'
                        >
                            <Plus size={18} strokeWidth={3} /> 
                            <span className='hidden sm:block'>Create</span>
                        </Link>

                        {/* User Profile */}
                        <Link to='/dashboard' className='transition-transform active:scale-90'>
                            <img src={getSecureUrl(userData?.avatar)} className='w-10 h-10 rounded-2xl object-cover border-2 border-white/5 hover:border-blue-500/50 transition-all shadow-lg'/>
                        </Link>
                        
                        <div className="hidden lg:block border-l border-white/5 h-8 ml-2"></div>
                        <LogoutBtn />
                    </div>
                ) : (
                    <div className='flex items-center gap-4'>
                        <Link to="/login" className='text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors'>Login</Link>
                        <Link to="/signup" className='bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]'>Join Now</Link>
                    </div>
                )}
            </div>
        </header>
    )
}
export default Header