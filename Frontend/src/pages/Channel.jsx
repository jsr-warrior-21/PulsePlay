import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance, { getSecureUrl } from '../api/axios';

function Channel() {
    const { username: urlParam } = useParams(); // Sidebar se ab 'testuser' ya 'arvind' aayega
    const [channelData, setChannelData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChannelProfile = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/users/c/${urlParam}`);
                
                if (res.data?.success) {
                    setChannelData(res.data.data);
                }
            } catch (err) {
                console.error("Profile Fetch Error:", err);
                setChannelData(null);
            } finally {
                setLoading(false);
            }
        };

        if (urlParam) fetchChannelProfile();
    }, [urlParam]); // dependency array mein username

    // Subscribe Toggle Logic
    const handleSubscribe = async () => {
        try {
            // Subscribe toggle ke liye humein channel._id ki zaroorat padegi
            await axiosInstance.post(`/subscriptions/c/${channelData._id}`);
            
            // Sidebar update signal
            window.dispatchEvent(new Event("subscriptionChange"));
            
            // UI update
            setChannelData(prev => ({
                ...prev,
                isSubscribed: !prev.isSubscribed,
                subscriberCount: prev.isSubscribed ? prev.subscriberCount - 1 : prev.subscriberCount + 1
            }));
        } catch (err) {
            alert("Bhai, subscribe button kaam nahi kiya!");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#0f0f0f] text-white">Loading Profile...</div>;
    if (!channelData) return <div className="p-20 text-center text-white">404: User Profile Not Found</div>;

    return (
        <div className="flex-1 bg-[#0f0f0f] min-h-screen text-white text-left">
            <div className="h-48 md:h-60 bg-gradient-to-r from-blue-900 to-black relative border-b border-gray-800">
                {channelData.coverImage && <img src={getSecureUrl(channelData.coverImage)} className="w-full h-full object-cover" />}
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 relative z-10">
                    <img src={getSecureUrl(channelData.avatar)} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0f0f0f] object-cover bg-gray-800 shadow-2xl" />
                    
                    <div className="mb-4 flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{channelData.fullName}</h1>
                        <p className="text-gray-400 text-lg mt-1">
                            @{channelData.username} • <span className='text-white font-bold'>{channelData.subscriberCount} subscribers</span>
                        </p>
                    </div>

                    <div className="mb-4">
                        <button 
                            onClick={handleSubscribe}
                            className={`${channelData.isSubscribed ? 'bg-gray-700' : 'bg-white text-black'} px-8 py-2.5 rounded-full font-black transition`}
                        >
                            {channelData.isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>
                    </div>
                </div>
                {/* Content... */}
            </div>
        </div>
    );
}
export default Channel;