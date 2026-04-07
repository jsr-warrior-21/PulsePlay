import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axios'

function History() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchHistory = async () => {
        try {
            const res = await axiosInstance.get("/users/history")
            setHistory(res.data.data || [])
        } catch (err) {
            console.error("Fetch history error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleClearHistory = async () => {
        if (!window.confirm("Clear Watch History?")) return;
        try {
            await axiosInstance.post("/users/clear-history")
            setHistory([])
        } catch (err) {
            alert("Failed to clear history")
        }
    }

    //  New: Single Video Remove Logic
    const handleRemoveFromHistory = async (e, videoId) => {
        e.stopPropagation(); 
        try {
            await axiosInstance.delete(`/users/history/${videoId}`)
            setHistory(prev => prev.filter(v => v._id !== videoId))
        } catch (err) {
            alert("Not able to remove video !")
            console.error(err)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    return (
        <div className='max-w-6xl mx-auto p-4 md:p-8 text-left min-h-screen text-white'>
            <div className='flex justify-between items-center mb-10 border-b border-zinc-800 pb-6'>
                <h1 className='text-3xl md:text-5xl font-black uppercase italic tracking-tighter'>Watch History</h1>
                {history.length > 0 && (
                    <button 
                        onClick={handleClearHistory}
                        className='text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 px-6 py-2 rounded-full border border-red-500/20 transition-all'
                    >
                        Clear all history
                    </button>
                )}
            </div>

            {loading ? (
                <p className="animate-pulse text-zinc-600 font-black uppercase italic tracking-widest">Syncing History...</p>
            ) : (
                <div className='flex flex-col gap-6'>
                    {history.length > 0 ? history.map(v => (
                        <div key={v._id} className='relative flex flex-col md:flex-row gap-6 bg-[#1a1a1a] p-5 rounded-[2rem] border border-zinc-800 hover:border-zinc-700 transition-all group shadow-xl'>
                            
                            {/*  Remove Button (X) */}
                            <button 
                                onClick={(e) => handleRemoveFromHistory(e, v._id)}
                                className="absolute top-4 right-6 text-zinc-600 hover:text-red-500 text-xl font-black transition-colors z-10 opacity-0 group-hover:opacity-100"
                                title="Remove from history"
                            >
                                ✕
                            </button>

                            <div className='w-full md:w-80 aspect-video shrink-0 overflow-hidden rounded-2xl'>
                                <img src={v.thumbnail} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' alt={v.title} />
                            </div>
                            <div className='flex-1 flex flex-col justify-center pr-8'>
                                <h2 className='text-2xl font-black tracking-tight line-clamp-2 italic uppercase'>{v.title}</h2>
                                <p className='text-zinc-500 font-bold text-sm mt-1 uppercase tracking-wider'>
                                    {v.owner?.fullName} <span className="mx-2">•</span> {v.views} views
                                </p>
                                <p className='text-zinc-400 text-sm mt-4 line-clamp-2 font-medium leading-relaxed'>{v.description}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="py-40 text-center">
                            <p className='text-zinc-600 font-black uppercase italic tracking-widest'>Watch History Empty.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default History