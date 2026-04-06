import React, { useState, useEffect, useRef } from 'react';
import axiosInstance, { getSecureUrl } from '../api/axios';
import { useSelector } from 'react-redux';

function Community() {
    const [tweetContent, setTweetContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [tweets, setTweets] = useState([]);
    const { userData } = useSelector(state => state.auth);
    
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const fileInputRef = useRef(null);

    const fetchTweets = async () => {
        if (!userData?._id) return;
        try {
            // Note: Backend controller needs to send 'isLiked' and 'likesCount' for best results
            const res = await axiosInstance.get("/tweets/user/" + userData?._id); 
            setTweets(res.data.data || []);
        } catch (err) { console.error("Fetch Error:", err); }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handlePostTweet = async () => {
        if (!tweetContent.trim() && !imageFile) return;
        const formData = new FormData();
        formData.append("content", tweetContent);
        if (imageFile) formData.append("image", imageFile);

        try {
            const res = await axiosInstance.post("/tweets", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setTweets([res.data.data, ...tweets]);
            setTweetContent("");
            setImageFile(null);
            setImagePreview(null);
        } catch (err) { alert("Post failed!"); }
    };

    // 🔥 Toggle Like Logic
    const handleToggleLike = async (tweetId) => {
        try {
            const res = await axiosInstance.post(`/likes/toggle/tweet/${tweetId}`);
            const isLikedNow = res.data.data.isLiked;

            // UI ko bina refresh kiye update karo (Optimistic UI)
            setTweets(prev => prev.map(t => {
                if (t._id === tweetId) {
                    return {
                        ...t,
                        isLiked: isLikedNow,
                        likesCount: isLikedNow ? (t.likesCount || 0) + 1 : (t.likesCount || 1) - 1
                    }
                }
                return t;
            }));
        } catch (err) {
            console.error("Like error:", err);
        }
    };

    const handleRemoveImage = async (id) => {
        if (!window.confirm("Bhai, sirf photo hata du? Post rahegi.")) return;
        try {
            await axiosInstance.patch(`/tweets/remove-image/${id}`);
            setTweets(tweets.map(t => t._id === id ? { ...t, image: "" } : t));
        } catch (err) { alert("Photo hatane mein error aaya!"); }
    };

    const handleDeleteTweet = async (id) => {
        if (!window.confirm("Bhai, poori post uda du?")) return;
        try {
            await axiosInstance.delete(`/tweets/${id}`);
            setTweets(tweets.filter(t => t._id !== id));
        } catch (err) { alert("Delete failed"); }
    };

    const handleUpdateTweet = async (id) => {
        if (!editContent.trim()) return;
        try {
            const res = await axiosInstance.patch(`/tweets/${id}`, { content: editContent });
            setTweets(tweets.map(t => t._id === id ? { ...t, content: editContent } : t));
            setEditingId(null);
        } catch (err) { alert("Update failed"); }
    };

    useEffect(() => { if(userData) fetchTweets(); }, [userData]);

    return (
        <div className="max-w-3xl mx-auto p-4 text-left min-h-screen text-white">
            <h2 className="text-3xl font-black mb-8 uppercase italic tracking-tighter">Community Feed</h2>
            
            {/* Post Input Box */}
            <div className="bg-[#1a1a1a] p-6 rounded-[2.5rem] border border-gray-800 mb-10 shadow-2xl">
                <textarea 
                    className="w-full bg-transparent text-lg outline-none border-none resize-none h-20 placeholder:text-gray-600"
                    placeholder="What's happening?"
                    value={tweetContent}
                    onChange={(e) => setTweetContent(e.target.value)}
                />

                {imagePreview && (
                    <div className="relative mt-4 mb-2 bg-[#0f0f0f] p-3 rounded-3xl border border-gray-800 overflow-hidden shadow-inner">
                        <img src={imagePreview} className="w-full max-h-64 object-contain mx-auto rounded-xl" alt="preview" />
                        <button onClick={() => {setImageFile(null); setImagePreview(null)}} className="absolute top-5 right-5 bg-black/80 text-white p-1 rounded-full text-xs hover:bg-red-600 border border-white/10">✕</button>
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-800/50 mt-4">
                    <button onClick={() => fileInputRef.current.click()} className="text-zinc-400 hover:text-blue-500 flex items-center gap-2 transition-all">
                        <span className="text-xl">🖼️</span>
                        <span className="text-xs font-black uppercase tracking-widest">Add Photo</span>
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                    </button>
                    <button onClick={handlePostTweet} className="bg-blue-600 hover:bg-blue-500 px-10 py-2.5 rounded-full font-black uppercase text-xs tracking-widest shadow-lg">Post</button>
                </div>
            </div>

            {/* Tweets Feed */}
            <div className="space-y-6 pb-20">
                {tweets.map(t => (
                    <div key={t._id} className="bg-[#1a1a1a] p-6 rounded-[2.5rem] border border-gray-800 group relative shadow-xl hover:border-gray-700 transition-all">
                        <div className="flex gap-5">
                            <img src={getSecureUrl(t.owner?.avatar || userData?.avatar)} className="w-14 h-14 rounded-full object-cover border-2 border-gray-900 shadow-md" alt="avatar" />
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                        {new Date(t.createdAt).toLocaleString()}
                                    </p>
                                    
                                    {userData?._id === (t.owner?._id || t.owner) && (
                                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => {setEditingId(t._id); setEditContent(t.content)}} className="text-blue-500 text-[10px] font-black uppercase hover:underline">Edit</button>
                                            <button onClick={() => handleDeleteTweet(t._id)} className="text-red-500 text-[10px] font-black uppercase hover:underline">Delete</button>
                                        </div>
                                    )}
                                </div>

                                {editingId === t._id ? (
                                    <div className="mt-2">
                                        <textarea className="w-full bg-[#0f0f0f] border border-gray-700 p-4 rounded-2xl text-gray-200 outline-none focus:border-blue-500" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => handleUpdateTweet(t._id)} className="bg-blue-600 px-6 py-1.5 rounded-xl text-[10px] font-black uppercase">Save</button>
                                            <button onClick={() => setEditingId(null)} className="bg-zinc-800 px-6 py-1.5 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-200 text-lg font-medium leading-relaxed mb-4">{t.content}</p>
                                        
                                        {t.image && (
                                            <div className="mt-4 bg-[#0c0c0c] rounded-[2rem] border border-gray-800/50 p-4 group/img relative shadow-inner">
                                                <div className="overflow-hidden rounded-2xl">
                                                    <img src={getSecureUrl(t.image)} className="w-full max-h-[400px] object-contain mx-auto block transition-transform duration-700 hover:scale-[1.03]" alt="post" />
                                                </div>
                                                {userData?._id === (t.owner?._id || t.owner) && (
                                                    <button onClick={() => handleRemoveImage(t._id)} className="absolute top-6 right-6 bg-red-600/90 hover:bg-red-600 text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full opacity-0 group-hover/img:opacity-100 transition-all shadow-2xl backdrop-blur-md border border-white/10">Remove Photo</button>
                                                )}
                                            </div>
                                        )}

                                        {/* 🔥 Interactive Like Button Section */}
                                        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-800/30">
                                            <button 
                                                onClick={() => handleToggleLike(t._id)}
                                                className="flex items-center gap-2 group transition-all"
                                            >
                                                <div className={`p-2 rounded-full transition-all ${t.isLiked ? "bg-red-500/10" : "group-hover:bg-zinc-800"}`}>
                                                    <span className={`text-xl transition-transform group-active:scale-150 block ${t.isLiked ? "text-red-500" : "text-zinc-500"}`}>
                                                        {t.isLiked ? "❤️" : "🤍"}
                                                    </span>
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${t.isLiked ? "text-red-500" : "text-zinc-500"}`}>
                                                    {t.likesCount || 0}
                                                </span>
                                            </button>
                                            
                                            {/* Future Comment/Share icons can go here */}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Community;