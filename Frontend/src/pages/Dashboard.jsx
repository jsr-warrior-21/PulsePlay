import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import VideoCard from '../components/VideoCard';

function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axiosInstance.get("/dashboard").then(res => setData(res.data.data)); 
    }, []);

    if (!data) return <div className="p-20 text-center">Loading Dashboard...</div>;

    const { stats, videos } = data;

    return (
        <div className="max-w-7xl mx-auto p-4 text-left">
            {/* Real Stats from Backend #9 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: "Total Views", val: stats.totalViews, icon: "👁️" },
                    { label: "Videos", val: stats.totalVideos, icon: "📹" },
                    { label: "Likes", val: stats.totalLikes, icon: "❤️" },
                    { label: "Subscribers", val: stats.totalSubscribers, icon: "👥" }
                ].map((s, i) => (
                    <div key={i} className="bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800">
                        <p className="text-gray-500 text-xs font-black uppercase">{s.icon} {s.label}</p>
                        <h2 className="text-3xl font-black mt-2">{s.val}</h2>
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-bold mb-6">Manage Your Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {videos.map(v => (
                    <div key={v._id} className="relative group">
                        <VideoCard {...v} />
                        {/* Delete/Update Actions #2 */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-red-600 p-2 rounded-lg text-xs" onClick={() => {/* Delete Logic */}}>🗑️</button>
                            <button className="bg-blue-600 p-2 rounded-lg text-xs" onClick={() => {/* Update Logic */}}>✏️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Dashboard;