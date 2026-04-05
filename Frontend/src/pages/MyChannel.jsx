import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../api/axios'
import { Container, VideoCard } from '../components'

function MyChannel() {
    const [videos, setVideos] = useState([])
    const [stats, setStats] = useState(null)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        // 1. Fetch User Videos
        axiosInstance.get(`/dashboard/videos`).then((res) => {
            if (res.data) setVideos(res.data.data)
        })
        // 2. Fetch Channel Stats
        axiosInstance.get(`/dashboard/stats`).then((res) => {
            if (res.data) setStats(res.data.data)
        })
    }, [])

    if (!userData) return <div className="text-white text-center py-10">Please Login</div>

    return (
        <div className="w-full bg-gray-900 min-h-screen text-white">
            {/* Banner & Avatar */}
            <div className="w-full h-40 bg-blue-900 relative">
                <img src={userData.coverImage} className="w-full h-full object-cover opacity-50" />
                <div className="absolute -bottom-10 left-10 flex items-center gap-4">
                    <img src={userData.avatar} className="w-24 h-24 rounded-full border-4 border-gray-900 object-cover" />
                    <div className="mt-8">
                        <h1 className="text-2xl font-bold">{userData.fullName}</h1>
                        <p className="text-gray-400">@{userData.username}</p>
                    </div>
                </div>
            </div>

            <Container>
                <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-800 p-4 rounded-xl">
                        <h2 className="text-xl font-bold">{stats?.totalSubscribers || 0}</h2>
                        <p className="text-gray-400">Subscribers</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-xl">
                        <h2 className="text-xl font-bold">{stats?.totalViews || 0}</h2>
                        <p className="text-gray-400">Total Views</p>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-800 pt-6">
                    <h2 className="text-xl font-bold mb-4">My Uploaded Videos</h2>
                    <div className="flex flex-wrap">
                        {videos.map((video) => (
                            <div key={video._id} className="p-2 w-1/4">
                                <VideoCard {...video} />
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default MyChannel