import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axiosInstance from '../api/axios'
import VideoCard from '../components/VideoCard'

function SearchPage() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q")
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return
            setLoading(true)
            try {
                // Backend controller getAllVideos ko query bhej rahe hain
                const res = await axiosInstance.get(`/videos?query=${query}`)
                setVideos(res.data.data.docs || [])
            } catch (err) { 
                console.error("Search fetch error:", err) 
            } finally { 
                setLoading(false) 
            }
        }
        fetchResults()
    }, [query])

    if (loading) return <div className="p-10 text-center text-white animate-pulse font-bold">Searching PulsePlay...</div>

    return (
        <div className="max-w-[1500px] mx-auto p-4 md:p-8 text-left min-h-screen">
            <h1 className="text-xl mb-8 text-gray-400 font-medium">
                Showing results for: <span className="text-white font-black italic">"{query}"</span>
            </h1>
            
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {videos.map(v => (
                        <VideoCard key={v._id} video={v} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20">
                    <span className="text-6xl mb-4">🔎</span>
                    <h2 className="text-xl font-bold text-gray-300">Video not found !!</h2>
                    <p className="text-gray-500 mt-2">Search something with different name..</p>
                </div>
            )}
        </div>
    )
}
export default SearchPage