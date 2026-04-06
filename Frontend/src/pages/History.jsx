import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios'
import VideoCard from '../components/VideoCard'

function History() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosInstance.get("/users/history") // Endpoint #27
            .then(res => {
                setHistory(res.data.data || [])
                setLoading(false)
            })
    }, [])

    return (
        <div className='max-w-6xl mx-auto p-4 text-left'>
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-3xl font-black'>Watch History</h1>
                <button className='text-red-500 text-sm font-bold hover:bg-red-500/10 px-4 py-2 rounded-full'>Clear all history</button>
            </div>

            {loading ? <p>Loading history...</p> : (
                <div className='flex flex-col gap-4'>
                    {history.length > 0 ? history.map(v => (
                        <div key={v._id} className='flex flex-col md:flex-row gap-4 bg-[#1a1a1a] p-4 rounded-2xl border border-gray-800 hover:border-gray-600 transition cursor-pointer'>
                            <div className='w-full md:w-64 aspect-video shrink-0'>
                                <img src={v.thumbnail} className='w-full h-full object-cover rounded-xl' alt="" />
                            </div>
                            <div className='flex-1'>
                                <h2 className='text-xl font-bold line-clamp-2'>{v.title}</h2>
                                <p className='text-gray-400 text-sm mt-1'>{v.owner.fullName} • {v.views} views</p>
                                <p className='text-gray-500 text-xs mt-4 line-clamp-2'>{v.description}</p>
                            </div>
                        </div>
                    )) : <p className='text-gray-500 py-20 text-center italic'>Watch History Empty.</p>}
                </div>
            )}
        </div>
    )
}

export default History