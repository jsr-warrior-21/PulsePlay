import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance, { getSecureUrl } from '../../api/axios'
import LogoutBtn from './LogoutBtn'

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
            // Count refresh agar wo unread thi
            const target = notifications.find(n => n._id === id)
            if (target && !target.isRead) setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (err) { console.error("Delete failed", err) }
    }

    const getNotificationMessage = (n) => {
        const sender = n.fromUser?.username || "Someone";
        switch (n.type) {
            case "video_like": return `${sender} liked your video: ${n.video?.title || ""}`;
            case "comment": return `${sender} commented on your video`;
            case "subscription": return `${sender} subscribed to your channel`;
            case "comment_like": return `${sender} liked your comment`;
            default: return `${sender} interacted with your content`;
        }
    }

    return (
        <header className='h-16 bg-[#0f0f0f] border-b border-zinc-800 sticky top-0 z-50 px-4 flex items-center justify-between gap-4'>
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            
            <Link to='/' className='text-xl font-black text-white shrink-0'>
                <span className='bg-red-600 px-2 py-0.5 rounded-lg'>P</span> PulsePlay
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block text-left">
                <div className="relative group">
                    <input 
                        type="text"
                        className="w-full bg-[#121212] border border-zinc-800 rounded-full py-2 px-5 pl-10 outline-none focus:border-blue-600 transition-all text-sm font-medium text-white"
                        placeholder="Search PulsePlay..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span className="absolute left-3.5 top-2.5 text-zinc-500"></span>
                </div>
            </form>
            
            <div className='flex items-center gap-4 shrink-0'>
                {status ? (
                    <div className='flex items-center gap-5 relative'>
                        <button onClick={fetchNotifications} className={`relative text-xl transition-all ${unreadCount > 0 ? "text-yellow-500 animate-pulse" : "text-zinc-400"}`}>
                            🔔
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[10px] items-center justify-center font-bold text-white shadow-lg">{unreadCount > 9 ? '9+' : unreadCount}</span>
                                </span>
                            )}
                        </button>

                        {showNotif && (
                            <div className="absolute top-12 right-0 w-84 bg-[#1a1a1a] border border-zinc-800 rounded-2xl shadow-2xl p-4 z-[100] animate-in fade-in zoom-in duration-200 min-w-[320px] text-left">
                                <div className="flex justify-between items-center mb-3 border-b border-zinc-800 pb-2">
                                    <h3 className="font-bold text-white uppercase italic tracking-tighter text-sm">Notifications</h3>
                                    {notifications.length > 0 && <button onClick={handleClearAll} className="text-[10px] text-blue-500 font-bold hover:underline">MARK ALL READ</button>}
                                </div>
                                
                                <div className="space-y-1.5 max-h-[400px] overflow-y-auto no-scrollbar">
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <div key={n._id} className={`group relative text-sm p-3 rounded-xl cursor-pointer flex gap-3 items-start transition-all ${!n.isRead ? "bg-blue-600/10 border-l-2 border-blue-500" : "hover:bg-zinc-800/50"}`} onClick={() => handleMarkAsRead(n._id)}>
                                            <img src={getSecureUrl(n.fromUser?.avatar)} className="w-8 h-8 rounded-full object-cover shrink-0" alt="" />
                                            <div className="flex-1 min-w-0 pr-4">
                                                <p className={`${!n.isRead ? "text-white font-semibold" : "text-zinc-400"} text-[11px] leading-tight`}>{getNotificationMessage(n)}</p>
                                                <span className="text-[9px] text-zinc-500 mt-1 block uppercase font-bold">{new Date(n.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                            <button onClick={(e) => handleDeleteNotif(e, n._id)} className="opacity-0 group-hover:opacity-100 absolute right-2 top-2 text-zinc-500 hover:text-white transition-all p-1">✕</button>
                                            {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 shrink-0"></div>}
                                        </div>
                                    )) : <p className="text-zinc-500 text-center py-10 text-xs italic">No notifications yet</p>}
                                </div>
                            </div>
                        )}

                        <Link to='/add-video' className='bg-[#272727] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#333] transition-colors text-white'>+ Create</Link>
                        <Link to='/dashboard'><img src={getSecureUrl(userData?.avatar)} className='w-9 h-9 rounded-full object-cover border border-zinc-700'/></Link>
                        <LogoutBtn />
                    </div>
                ) : (
                    <div className='flex gap-3'>
                        <Link to="/login" className='text-sm font-bold text-white'>Login</Link>
                        <Link to="/signup" className='bg-white text-black px-4 py-2 rounded-full text-sm font-bold'>Sign up</Link>
                    </div>
                )}
            </div>
        </header>
    )
}
export default Header