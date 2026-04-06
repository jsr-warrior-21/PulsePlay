import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../api/axios'
import { Container, VideoCard, Button } from '../components'

function MyChannel() {
    const [videos, setVideos] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const userData = useSelector((state) => state.auth.userData)

    // Helper function to force HTTPS for Cloudinary images
    const getSecureUrl = (url) => {
        if (!url) return "";
        return url.replace("http://", "https://");
    };

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                setLoading(true);
                const videoRes = await axiosInstance.get(`/dashboard/videos`);
                const vData = videoRes.data?.message?.docs || videoRes.data?.message || [];
                setVideos(Array.isArray(vData) ? vData : []);

                const statsRes = await axiosInstance.get(`/dashboard/stats`);
                if (statsRes.data?.message) {
                    setStats(statsRes.data.message); 
                }
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userData) fetchChannelData();
    }, [userData]);

    const handleDeleteVideo = async (videoId) => {
        if (window.confirm("Bhai, pakka delete kar du?")) {
            try {
                await axiosInstance.delete(`/videos/${videoId}`)
                setVideos(videos.filter(v => v._id !== videoId))
                alert("Video deleted successfully!")
            } catch (error) {
                alert("Delete fail ho gaya!")
            }
        }
    }

    if (!userData) return <div className="text-white text-center py-20 text-2xl">Please Login to view your channel</div>
    if (loading) return <div className="text-white text-center py-20">Loading your channel...</div>

    return (
        <div className="w-full bg-[#0f0f0f] min-h-screen text-white pb-10 text-left">
            {/* Banner & Profile Section */}
            <div className="w-full h-48 bg-gradient-to-r from-blue-900 to-purple-900 relative">
                {userData.coverImage && (
                    <img 
                        src={getSecureUrl(userData.coverImage)} 
                        className="w-full h-full object-cover opacity-60" 
                        alt="banner" 
                        onError={(e) => e.target.style.display = 'none'} // Hide if broken
                    />
                )}
                <div className="absolute -bottom-12 left-10 flex items-end gap-6">
                    <div className="relative">
                        <img 
                            src={getSecureUrl(userData.avatar) || `https://ui-avatars.com/api/?name=${userData.username}`} 
                            className="w-32 h-32 rounded-full border-4 border-[#0f0f0f] object-cover bg-gray-800 shadow-2xl" 
                            alt="avatar"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${userData.username}`;
                            }}
                        />
                    </div>
                    <div className="mb-2">
                        <h1 className="text-3xl font-bold">{userData.fullName}</h1>
                        <p className="text-gray-400 font-medium">@{userData.username}</p>
                    </div>
                </div>
            </div>

            <Container>
                {/* Channel Stats Cards */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
                        <h2 className="text-2xl font-bold">{stats?.totalSubscribers || 0}</h2>
                        <p className="text-gray-400 text-sm uppercase">Subscribers</p>
                    </div>
                    <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
                        <h2 className="text-2xl font-bold">{stats?.totalViews || 0}</h2>
                        <p className="text-gray-400 text-sm uppercase">Total Views</p>
                    </div>
                    <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
                        <h2 className="text-2xl font-bold">{videos.length}</h2>
                        <p className="text-gray-400 text-sm uppercase">Videos</p>
                    </div>
                    <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
                        <h2 className="text-2xl font-bold">{stats?.totalLikes || 0}</h2>
                        <p className="text-gray-400 text-sm uppercase">Likes</p>
                    </div>
                </div>

                {/* Video Management Section */}
                <div className="mt-12 border-t border-gray-800 pt-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Manage Your Videos</h2>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
                            Customize Channel
                        </Button>
                    </div>

                    {videos.length === 0 ? (
                        <div className="text-center py-20 bg-[#1a1a1a] rounded-3xl border-2 border-dashed border-gray-800">
                            <p className="text-gray-500 text-lg font-semibold">Koi video nahi mili bhai. Kuch upload toh karo!</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap -mx-2">
                            {videos.map((video) => (
                                <div key={video._id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                                    <div className="relative group bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 transition hover:border-gray-600">
                                        <VideoCard {...video} />
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="bg-blue-600 p-2 rounded-lg hover:scale-110 shadow-lg" title="Edit Video">✏️</button>
                                            <button 
                                                onClick={() => handleDeleteVideo(video._id)}
                                                className="bg-red-600 p-2 rounded-lg hover:scale-110 shadow-lg" 
                                                title="Delete Video"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default MyChannel