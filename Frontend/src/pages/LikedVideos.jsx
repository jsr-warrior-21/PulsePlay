import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios'
import VideoCard from '../components/VideoCard'

function LikedVideos() {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosInstance.get("/likes/videos") // Tera Endpoint #7
            .then(res => {
                setVideos(res.data.data || [])
                setLoading(false)
            })
            .catch(err => console.log(err))
    }, [])

    if (loading) return <div className="p-10 text-center">Loading Liked Videos...</div>

    return (
        <div className="max-w-7xl mx-auto p-4 text-left">
            <h1 className="text-3xl font-black mb-8 text-white">Liked Videos</h1>
            
            {videos.length === 0 ? (
                <div className="py-20 text-center bg-[#1a1a1a] rounded-3xl border border-gray-800 text-gray-500 font-bold">
                    You have not liked any Video till now. Please like !
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {videos.map((v) => (
                        <VideoCard key={v._id} {...(v.video || v)} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default LikedVideos