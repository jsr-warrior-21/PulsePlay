import React, { useEffect, useState } from 'react';
import axiosInstance, { getSecureUrl } from '../api/axios';
import { useSelector } from 'react-redux';
import VideoCard from '../components/VideoCard';

function Dashboard() {
    const [data, setData] = useState(null);
    const { userData } = useSelector((state) => state.auth);
    const [updating, setUpdating] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: userData?.fullName || "",
        email: userData?.email || ""
    });

    const fetchDashboardData = () => {
        axiosInstance.get("/dashboard").then(res => {
            setData(res.data.data);
            setFormData({
                fullName: res.data.data.stats?.fullName || userData?.fullName,
                email: res.data.data.stats?.email || userData?.email
            });
        });
    };

    useEffect(() => {
        fetchDashboardData();
    }, [userData]);

    const handleDeleteVideo = async (videoId) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            setUpdating(true);
            try {
                await axiosInstance.delete(`/videos/${videoId}`);
                alert("Video deleted successfully");
                fetchDashboardData();
            } catch (err) {
                alert("Failed to delete video");
            } finally {
                setUpdating(false);
            }
        }
    };

    const handleUpdateVideo = async (videoId, oldTitle) => {
        const newTitle = window.prompt("Enter new title:", oldTitle);
        if (!newTitle || newTitle === oldTitle) return;

        setUpdating(true);
        try {
            await axiosInstance.patch(`/videos/${videoId}`, { title: newTitle });
            alert("Video updated successfully");
            fetchDashboardData();
        } catch (err) {
            alert("Failed to update video");
        } finally {
            setUpdating(false);
        }
    };

    const handleAvatarUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("avatar", file);
        setUpdating(true);
        try {
            await axiosInstance.patch("/users/avatar", formData);
            window.location.reload(); 
        } catch (err) {
            alert("Failed to update avatar");
        } finally { setUpdating(false); }
    };

    const handleCoverUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("coverImage", file);
        setUpdating(true);
        try {
            await axiosInstance.patch("/users/cover-image", formData);
            window.location.reload();
        } catch (err) {
            alert("Failed to update cover image");
        } finally { setUpdating(false); }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await axiosInstance.patch("/users/update-account", formData);
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            alert("Failed to update account details");
        } finally {
            setUpdating(false);
        }
    };

    if (!data) return (
        <div className="flex-1 flex items-center justify-center h-screen bg-[#0f0f0f]">
            <div className="text-xl font-black text-zinc-700 animate-pulse uppercase tracking-widest">Loading Dashboard...</div>
        </div>
    );

    const { stats, videos, subscribedChannels } = data;

    return (
        <div className="flex-1 bg-[#0f0f0f] text-white overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4 md:p-8 text-left">
                
                <div className="relative group h-40 md:h-52 w-full bg-zinc-900 rounded-3xl overflow-hidden mb-12 shadow-2xl border border-zinc-800">
                    <img 
                        src={getSecureUrl(userData?.coverImage)} 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-all duration-500" 
                        alt="cover"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                        <input type="file" className="hidden" onChange={handleCoverUpdate} accept="image/*" />
                        <span className="bg-white text-black px-6 py-2 rounded-full font-black text-sm shadow-xl transform scale-90 group-hover:scale-100 transition-transform">EDIT COVER</span>
                    </label>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-4 -mt-20 mb-12 relative z-10">
                    <div className="relative group">
                        <img 
                            src={getSecureUrl(userData?.avatar)} 
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-[#0f0f0f] object-cover bg-zinc-800 shadow-2xl" 
                            alt="avatar"
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                            <input type="file" className="hidden" onChange={handleAvatarUpdate} accept="image/*" />
                            <span className="text-[10px] font-black tracking-widest text-white border-b-2 border-white pb-1">CHANGE</span>
                        </label>
                    </div>

                    <div className="mb-2 text-center md:text-left flex-1">
                        {!isEditing ? (
                            <>
                                <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-tight">
                                    {userData?.fullName}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 mt-2">
                                    <p className="text-zinc-500 font-bold text-lg lowercase">@{userData?.username}</p>
                                    <span className="hidden md:block text-zinc-800 text-xl">•</span>
                                    <p className="text-zinc-400 font-medium text-sm">
                                        <span className="text-white font-bold">{stats.totalSubscribers || 0}</span> Subscribers
                                    </p>
                                    <span className="hidden md:block text-zinc-800 text-xl">•</span>
                                    <p className="text-zinc-400 font-medium text-sm">
                                        <span className="text-white font-bold">
                                            {subscribedChannels?.length || stats.channelsSubscribedTo || 0}
                                        </span> Subscribed
                                    </p>
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="ml-2 md:ml-4 bg-zinc-800/50 hover:bg-zinc-800 text-[10px] font-black text-blue-500 px-5 py-2 rounded-full uppercase tracking-widest transition-colors border border-zinc-700 shadow-lg"
                                    >
                                        Edit Info
                                    </button>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleAccountUpdate} className="flex flex-col gap-3 mt-4 max-w-sm">
                                <input 
                                    type="text" 
                                    value={formData.fullName} 
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                                    placeholder="Full Name"
                                />
                                <input 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                                    placeholder="Email Address"
                                />
                                <div className="flex gap-2 mt-1">
                                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all">Save</button>
                                    <button type="button" onClick={() => setIsEditing(false)} className="bg-zinc-800 hover:bg-zinc-700 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                    {[
                        { label: "Total Views", val: stats.totalViews, icon: "👁️" },
                        { label: "Videos", val: stats.totalVideos, icon: "📹" },
                        { label: "Likes", val: stats.totalLikes, icon: "❤️" },
                        { label: "Subscribers", val: stats.totalSubscribers, icon: "👥" }
                    ].map((s, i) => (
                        <div key={i} className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800/50 hover:border-zinc-700 transition-colors group">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{s.icon}</span> {s.label}
                            </p>
                            <h2 className="text-3xl font-black text-white tracking-tighter">{s.val}</h2>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Manage Your Videos</h2>
                    <span className="text-xs font-bold text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">{videos.length} Videos Total</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
                    {videos.map(v => (
                        <div key={v._id} className="relative group bg-zinc-900/30 p-2 rounded-3xl border border-transparent hover:border-zinc-800 transition-all hover:shadow-2xl">
                            <VideoCard {...v} />
                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <button className="bg-red-600/90 hover:bg-red-600 p-2.5 rounded-xl text-white shadow-lg backdrop-blur-sm" onClick={() => handleDeleteVideo(v._id)}>🗑️</button>
                                <button className="bg-zinc-100 hover:bg-white p-2.5 rounded-xl text-black shadow-lg backdrop-blur-sm" onClick={() => handleUpdateVideo(v._id, v.title)}>✏️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {updating && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="font-black text-sm tracking-widest uppercase text-white">Updating...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;