import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axiosInstance, { getSecureUrl } from '../../api/axios'
import LogoutBtn from './LogoutBtn'

function Header() {
    const { status, userData } = useSelector((state) => state.auth)
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [showNotif, setShowNotif] = useState(false)

    useEffect(() => {
        if (status) {
            // #9 & #10: Fetch stats and notifications
            axiosInstance.get("/dashboard").then(res => {
                setUnreadCount(res.data.data.unreadNotifications)
            })
        }
    }, [status])

    const fetchNotifications = async () => {
        const res = await axiosInstance.get("/notifications") // #10
        setNotifications(res.data.data.notifications)
        setShowNotif(!showNotif)
    }

    return (
        <header className='h-16 bg-[#0f0f0f] border-b border-gray-800 sticky top-0 z-50 px-4 flex items-center justify-between'>
            <Link to='/' className='text-xl font-black text-white'><span className='bg-red-600 px-2 py-0.5 rounded-lg'>P</span> PulsePlay</Link>
            
            <div className='flex items-center gap-4'>
                {status ? (
                    <div className='flex items-center gap-5 relative'>
                        {/* Bell Icon for Notifications #10 */}
                        <button onClick={fetchNotifications} className="relative text-xl">
                            🔔 {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] px-1.5 rounded-full">{unreadCount}</span>}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotif && (
                            <div className="absolute top-12 right-0 w-80 bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl p-4 z-[100]">
                                <h3 className="font-bold mb-3 border-b border-gray-800 pb-2">Notifications</h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <div key={n._id} className="text-sm p-2 hover:bg-[#272727] rounded-lg cursor-pointer">
                                            {n.message}
                                        </div>
                                    )) : <p className="text-gray-500 text-center py-4">No new notifications</p>}
                                </div>
                            </div>
                        )}

                        <Link to='/add-video' className='bg-[#272727] px-4 py-2 rounded-full text-sm font-bold'>+ Create</Link>
                        <Link to='/dashboard'><img src={getSecureUrl(userData?.avatar)} className='w-9 h-9 rounded-full object-cover border border-gray-700'/></Link>
                        <LogoutBtn />
                    </div>
                ) : (
                    <div className='flex gap-3'>
                        <Link to="/login" className='text-sm font-bold'>Login</Link>
                        <Link to="/signup" className='bg-white text-black px-4 py-2 rounded-full text-sm font-bold'>Sign up</Link>
                    </div>
                )}
            </div>
        </header>
    )
}
export default Header