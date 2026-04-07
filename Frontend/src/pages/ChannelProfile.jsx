import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance, { getSecureUrl } from '../api/axios'
import VideoCard from '../components/VideoCard'

function ChannelProfile() {
    const { username } = useParams()
    const [channel, setChannel] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                // 1. Get Channel Profile
                const channelRes = await axiosInstance.get(`/users/c/${username}`)
                setChannel(channelRes.data.data)

                // 2. Get Channel Videos (Using user ID from channel response)
                const videoRes = await axiosInstance.get(`/videos?userId=${channelRes.data.data._id}`)
                setVideos(videoRes.data.data.docs || [])
            } catch (err) {
                console.error("Channel error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchChannelData()
    }, [username])

    if (loading || !channel) return <div className="p-20 text-center animate-pulse">Loading Channel...</div>

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white">
            {/* Cover Image */}
            <div className="h-40 md:h-64 bg-zinc-900 w-full overflow-hidden border-b border-zinc-800">
                {channel.coverImage ? (
                    <img src={getSecureUrl(channel.coverImage)} className="w-full h-full object-cover" alt="cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-zinc-900 to-zinc-800" />
                )}
            </div>

            {/* Profile Info Section */}
            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center gap-8 text-left">
                <img src={getSecureUrl(channel.avatar)} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black object-cover shadow-2xl" />
                <div className="flex-1">
                    <h1 className="text-4xl font-black tracking-tighter">{channel.fullName}</h1>
                    <p className="text-zinc-500 font-bold mt-1 text-lg">@{channel.username}</p>
                    <div className="flex gap-4 mt-2 text-sm text-zinc-400 font-medium">
                        <span>{channel.subscriberCount} Subscribers</span>
                        <span>•</span>
                        <span>{videos.length} Videos</span>
                    </div>
                    <button className={`mt-6 px-10 py-2.5 rounded-full font-black text-sm uppercase transition-all ${
                        channel.isSubscribed ? "bg-zinc-800 text-zinc-400" : "bg-white text-black hover:bg-zinc-200"
                    }`}>
                        {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                </div>
            </div>

            {/* Videos Grid */}
            <div className="max-w-6xl mx-auto px-4 mt-8 pb-20">
                <div className="border-b border-zinc-800 mb-8">
                    <h2 className="text-sm font-black uppercase italic tracking-widest pb-3 border-b-2 border-white w-fit">Videos</h2>
                </div>
                {videos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videos.map(v => <VideoCard key={v._id} video={v} />)}
                    </div>
                ) : (
                    <p className="text-center text-zinc-500 py-20 italic">No videos uploaded yet by this channel.</p>
                )}
            </div>
        </div>
    )
}

export default ChannelProfile