import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import VideoCard from '../components/VideoCard';

function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get("/videos").then(res => {
            setVideos(res.data.data.docs || []);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 animate-pulse">
        {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-gray-800 aspect-video rounded-xl"></div>)}
    </div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {videos.map(video => (
                <VideoCard key={video._id} {...video} />
            ))}
        </div>
    );
}

export default Home;