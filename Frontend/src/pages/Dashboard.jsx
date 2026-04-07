import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance, { getSecureUrl } from '../api/axios';
import { useSelector } from 'react-redux';
import VideoCard from '../components/VideoCard';

function Dashboard() {
    const [data, setData] = useState(null);
    const { userData } = useSelector((state) => state.auth);
    const [updating, setUpdating] = useState(false);
    const [activeSection, setActiveSection] = useState("videos");
    const [tweets, setTweets] = useState([]);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editingTweetId, setEditingTweetId] = useState(null);
    const [tweetEditContent, setTweetEditContent] = useState("");
    const [formData, setFormData] = useState({
        fullName: userData?.fullName || "",
        email: userData?.email || ""
    });

    const fetchDashboardData = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/dashboard");
            setData(res.data.data);
            const tweetRes = await axiosInstance.get(`/tweets/user/${userData?._id}`);
            setTweets(tweetRes.data.data || []);
        } catch (err) { console.error("Dashboard Fetch Error:", err); }
    }, [userData]);

    useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

    //  Video Delete
    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;
        setUpdating(true);
        try {
            await axiosInstance.delete(`/videos/${videoId}`);
            fetchDashboardData();
        } catch (err) { alert("Delete failed"); }
        finally { setUpdating(false); }
    };

    // Video Edit (Title & Description)
    const handleEditVideo = async (videoId, oldTitle, oldDesc) => {
        const newTitle = window.prompt("Edit Video Title:", oldTitle);
        if (!newTitle) return;
        
        setUpdating(true);
        try {
            await axiosInstance.patch(`/videos/${videoId}`, { 
                title: newTitle,
                description: oldDesc 
            });
            fetchDashboardData();
        } catch (err) { alert("Update failed"); }
        finally { setUpdating(false); }
    };

    const handleDeleteTweet = async (tweetId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        setUpdating(true);
        try {
            await axiosInstance.delete(`/tweets/${tweetId}`);
            setTweets(prev => prev.filter(t => t._id !== tweetId));
        } catch (err) { alert("Delete failed"); }
        finally { setUpdating(false); }
    };

    const handleUpdateTweet = async (tweetId) => {
        if (!tweetEditContent.trim()) return;
        setUpdating(true);
        try {
            await axiosInstance.patch(`/tweets/${tweetId}`, { content: tweetEditContent });
            setTweets(prev => prev.map(t => t._id === tweetId ? { ...t, content: tweetEditContent } : t));
            setEditingTweetId(null);
        } catch (err) { alert("Update failed"); }
        finally { setUpdating(false); }
    };

    const handleAvatarUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const form = new FormData();
        form.append("avatar", file);
        setUpdating(true);
        try { await axiosInstance.patch("/users/avatar", form); window.location.reload(); }
        catch (err) { alert("Upload failed"); setUpdating(false); }
    };

    const handleCoverUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const form = new FormData();
        form.append("coverImage", file);
        setUpdating(true);
        try { await axiosInstance.patch("/users/cover-image", form); window.location.reload(); }
        catch (err) { alert("Upload failed"); setUpdating(false); }
    };

    if (!data) return <div className="h-screen bg-[#0f0f0f] flex items-center justify-center text-zinc-700 font-black italic tracking-widest animate-pulse uppercase">Syncing Dashboard...</div>;

    const stats = data.stats || {};
    const rawVideos = Array.isArray(data.videos) ? data.videos : (data.videos?.docs || []);
    const videosList = rawVideos.map(v => ({
        ...v,
        owner: userData 
    }));

    return (
        <div className="flex-1 bg-[#0f0f0f] text-white overflow-y-auto no-scrollbar">
            <div className="max-w-7xl mx-auto p-4 md:p-8 text-left">
                
                {/* Cover Section */}
                <div className="relative group h-40 md:h-52 w-full bg-zinc-900 rounded-3xl overflow-hidden mb-12 border border-zinc-800 shadow-2xl">
                    <img src={getSecureUrl(userData?.coverImage)} className="w-full h-full object-cover opacity-90" alt="cover" />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                        <input type="file" className="hidden" onChange={handleCoverUpdate} accept="image/*" />
                        <span className="bg-white text-black px-6 py-2 rounded-full font-black text-xs tracking-tighter">EDIT COVER</span>
                    </label>
                </div>

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-4 -mt-20 mb-12 relative z-10">
                    <div className="relative group">
                        <img src={getSecureUrl(userData?.avatar)} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-[#0f0f0f] object-cover bg-zinc-800 shadow-2xl" alt="avatar" />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                            <input type="file" className="hidden" onChange={handleAvatarUpdate} accept="image/*" />
                            <span className="text-[10px] font-black text-white border-b border-white pb-0.5">CHANGE</span>
                        </label>
                    </div>

                    <div className="mb-2 text-center md:text-left flex-1">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight italic">{userData?.fullName}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 mt-2">
                            <p className="text-zinc-500 font-bold text-lg lowercase">@{userData?.username}</p>
                            <span className="text-zinc-800 text-xl">•</span>
                            <p className="text-zinc-400 font-medium text-sm"><span className="text-white font-bold">{stats.totalSubscribers || 0}</span> Subscribers</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                    {[{ l: "Total Views", v: stats.totalViews }, { l: "Videos", v: stats.totalVideos || videosList.length }, { l: "Likes", v: stats.totalLikes }, { l: "Subscribers", v: stats.totalSubscribers }].map((s, i) => (
                        <div key={i} className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800/50 hover:border-zinc-700 transition-all">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">{s.l}</p>
                            <h2 className="text-3xl font-black text-white tracking-tighter">{s.v || 0}</h2>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-8 mb-8 border-b border-zinc-800">
                    <button onClick={() => setActiveSection("videos")} className={`pb-4 text-sm font-black uppercase italic tracking-widest ${activeSection === "videos" ? "border-b-2 border-white text-white" : "text-zinc-500"}`}>Manage Videos</button>
                    <button onClick={() => setActiveSection("tweets")} className={`pb-4 text-sm font-black uppercase italic tracking-widest ${activeSection === "tweets" ? "border-b-2 border-white text-white" : "text-zinc-500"}`}>Manage Posts</button>
                </div>

                {activeSection === "videos" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
                        {videosList.map(v => (
                            <div key={v._id} className="relative group bg-zinc-900/30 p-2 rounded-3xl border border-transparent hover:border-zinc-800 transition-all shadow-lg">
                                <VideoCard video={v} />
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button onClick={() => handleEditVideo(v._id, v.title, v.description)} className="bg-white text-black text-[9px] font-black px-4 py-1.5 rounded-lg shadow-xl hover:bg-zinc-200">EDIT</button>
                                    <button onClick={() => handleDeleteVideo(v._id)} className="bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-lg shadow-xl hover:bg-red-700">DELETE</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-4xl space-y-4 pb-20">
                        {tweets.length > 0 ? tweets.map(t => (
                            <div key={t._id} className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800 flex flex-col gap-4">
                                {editingTweetId === t._id ? (
                                    <div className="w-full">
                                        <textarea className="w-full bg-black border border-zinc-700 rounded-2xl p-4 text-sm outline-none focus:border-blue-500 transition-all" value={tweetEditContent} onChange={(e) => setTweetEditContent(e.target.value)} />
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => handleUpdateTweet(t._id)} className="bg-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Save</button>
                                            <button onClick={() => setEditingTweetId(null)} className="bg-zinc-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-zinc-300 text-sm leading-relaxed">{t.content}</p>
                                            <span className="text-[10px] text-zinc-600 font-bold uppercase mt-2 block">{new Date(t.createdAt).toDateString()}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => {setEditingTweetId(t._id); setTweetEditContent(t.content)}} className="text-blue-500 text-[10px] font-black uppercase hover:underline tracking-widest">Edit</button>
                                            <button onClick={() => handleDeleteTweet(t._id)} className="text-red-500 text-[10px] font-black uppercase hover:underline tracking-widest">Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )) : <p className="text-zinc-500 italic text-sm uppercase tracking-widest font-bold">No community posts yet.</p>}
                    </div>
                )}
            </div>
            {updating && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]"><p className="font-black text-white animate-pulse italic tracking-widest uppercase text-xs">Syncing Pulse...</p></div>}
        </div>
    );
}

export default Dashboard;