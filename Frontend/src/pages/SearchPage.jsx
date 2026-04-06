import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axiosInstance from '../api/axios'
import VideoCard from '../components/VideoCard'

function SearchPage() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get("q")
    const [results, setResults] = useState({ videos: [], users: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true)
            try {
                const [vidRes, userRes] = await Promise.all([
                    axiosInstance.get(`/search/videos?q=${query}`), // #29
                    axiosInstance.get(`/search/users?q=${query}`)   // #28
                ])
                setResults({ videos: vidRes.data.data, users: userRes.data.data })
            } catch (err) { console.error(err) }
            finally { setLoading(false) }
        }
        if (query) fetchResults()
    }, [query])

    if (loading) return <div className="p-10">Searching PulsePlay...</div>

    return (
        <div className="max-w-7xl mx-auto p-4 text-left">
            <h1 className="text-xl mb-6 text-gray-400">Search results for: <span className="text-white font-bold">"{query}"</span></h1>
            
            {/* Users Section */}
            {results.users.length > 0 && (
                <div className="mb-10 space-y-4">
                    <h2 className="text-lg font-bold border-b border-gray-800 pb-2">Channels</h2>
                    {results.users.map(user => (
                        <div key={user._id} className="flex items-center gap-6 p-4 bg-[#1a1a1a] rounded-2xl border border-gray-800">
                            <img src={user.avatar} className="w-20 h-20 rounded-full object-cover" alt="" />
                            <div>
                                <h3 className="text-xl font-bold">{user.fullName}</h3>
                                <p className="text-gray-500 text-sm">@{user.username}</p>
                            </div>
                            <button className="ml-auto bg-white text-black px-6 py-2 rounded-full font-bold">View Channel</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Videos Section */}
            <h2 className="text-lg font-bold border-b border-gray-800 pb-2 mb-6">Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.videos.map(v => <VideoCard key={v._id} {...v} />)}
                {results.videos.length === 0 && <p className="text-gray-500">No videos found.</p>}
            </div>
        </div>
    )
}

export default SearchPage