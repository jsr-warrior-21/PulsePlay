import React, { useState, useEffect } from 'react';
import axiosInstance, { getSecureUrl } from '../api/axios';
import { useSelector } from 'react-redux';

function Community() {
    const [tweetContent, setTweetContent] = useState("");
    const [tweets, setTweets] = useState([]);
    const { userData } = useSelector(state => state.auth);

    const fetchTweets = async () => {
        try {
            const res = await axiosInstance.get("/tweets/user/" + userData?._id); 
            setTweets(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handlePostTweet = async () => {
        if (!tweetContent.trim()) return;
        const res = await axiosInstance.post("/tweets", { content: tweetContent });
        setTweets([res.data.data, ...tweets]);
        setTweetContent("");
    };

    const handleDeleteTweet = async (id) => {
        if (!window.confirm("Bhai, post uda du?")) return;
        await axiosInstance.delete(`/tweets/${id}`);
        setTweets(tweets.filter(t => t._id !== id));
    };

    useEffect(() => { if(userData) fetchTweets(); }, [userData]);

    return (
        <div className="max-w-3xl mx-auto p-4 text-left">
            <h2 className="text-2xl font-bold mb-6 text-white">Community Feed</h2>
            <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800 mb-8">
                <textarea 
                    className="w-full bg-transparent text-lg outline-none border-none"
                    placeholder="Bhai, kya chal raha hai?"
                    value={tweetContent}
                    onChange={(e) => setTweetContent(e.target.value)}
                />
                <div className="flex justify-end pt-4 border-t border-gray-800 mt-4">
                    <button onClick={handlePostTweet} className="bg-blue-600 px-8 py-2 rounded-full font-bold">Post</button>
                </div>
            </div>

            <div className="space-y-4">
                {tweets.map(t => (
                    <div key={t._id} className="bg-[#1a1a1a] p-5 rounded-3xl border border-gray-800 group relative">
                        <div className="flex gap-4">
                            {/* Avatar Fix: Backend se owner detail fetch karna zaroori hai */}
                            <img 
                                src={getSecureUrl(t.owner?.avatar || userData?.avatar)} 
                                className="w-12 h-12 rounded-full object-cover border border-gray-700" 
                            />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">
                                    POSTED ON {new Date(t.createdAt).toLocaleString()}
                                </p>
                                <p className="text-gray-200 text-lg">{t.content}</p>
                            </div>
                        </div>
                        {/* Delete/Edit buttons - Sirf tab dikhao jab user owner ho */}
                        {(userData?._id === t.owner?._id || userData?._id === t.owner) && (
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDeleteTweet(t._id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">🗑️</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Community;