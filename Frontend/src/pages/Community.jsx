import React, { useState, useEffect, useRef } from 'react';
import axiosInstance, { getSecureUrl } from '../api/axios';
import { useSelector } from 'react-redux';
// Premium Icons
import { Image as ImageIcon, Send, Heart, Trash2, Edit3, X, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
            const res = await axiosInstance.get("/tweets/user/" + userData?._id); 
            setTweets(res.data.data || []);
        } catch (err) { 
            console.error("Fetch Error:", err); 
        }
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
            const newTweet = {
                ...res.data.data,
                likesCount: 0,
                isLiked: false,
                owner: userData
            };
            setTweets([newTweet, ...tweets]);
            setTweetContent("");
            setImageFile(null);
            setImagePreview(null);
        } catch (err) { 
            alert("Failed to post the content. Please try again."); 
        }
    };

    const handleToggleLike = async (tweetId) => {
        try {
            const res = await axiosInstance.post(`/likes/toggle/tweet/${tweetId}`);
            const isLikedNow = res.data.data.isLiked;

            setTweets(prev => prev.map(t => {
                if (t._id === tweetId) {
                    const currentCount = t.likesCount || 0;
                    return {
                        ...t,
                        isLiked: isLikedNow,
                        likesCount: isLikedNow ? currentCount + 1 : Math.max(0, currentCount - 1)
                    }
                }
                return t;
            }));
        } catch (err) {
            console.error("Like operation failed:", err);
        }
    };

    const handleRemoveImage = async (id) => {
        if (!window.confirm("Are you sure you want to remove this photo?")) return;
        try {
            await axiosInstance.patch(`/tweets/remove-image/${id}`);
            setTweets(tweets.map(t => t._id === id ? { ...t, image: "" } : t));
        } catch (err) { 
            alert("Error removing the image."); 
        }
    };

    const handleDeleteTweet = async (id) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axiosInstance.delete(`/tweets/${id}`);
            setTweets(tweets.filter(t => t._id !== id));
        } catch (err) { 
            alert("Failed to delete the post."); 
        }
    };

    const handleUpdateTweet = async (id) => {
        if (!editContent.trim()) return;
        try {
            await axiosInstance.patch(`/tweets/${id}`, { content: editContent });
            setTweets(tweets.map(t => t._id === id ? { ...t, content: editContent } : t));
            setEditingId(null);
        } catch (err) { 
            alert("Failed to update the post."); 
        }
    };

    useEffect(() => { 
        if(userData) fetchTweets(); 
    }, [userData]);

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-10 text-left min-h-screen text-white selection:bg-blue-500/30">
            <h2 className="text-4xl font-black mb-12 uppercase italic tracking-tighter flex items-center gap-4">
                <span className="w-2 h-10 bg-blue-600 rounded-full"></span>
                Community Feed
            </h2>
            
            {/* Post Input Box - Glassmorphism */}
            <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 mb-12 shadow-2xl transition-all hover:border-white/10">
                <div className="flex gap-4">
                    <img src={getSecureUrl(userData?.avatar)} className="w-12 h-12 rounded-2xl object-cover border border-white/10" alt="" />
                    <textarea 
                        className="flex-1 bg-transparent text-lg outline-none border-none resize-none h-24 placeholder:text-zinc-600 font-medium pt-2"
                        placeholder="What's on your mind, creator?"
                        value={tweetContent}
                        onChange={(e) => setTweetContent(e.target.value)}
                    />
                </div>

                {imagePreview && (
                    <div className="relative mt-6 group bg-black/40 p-4 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                        <img src={imagePreview} className="w-full max-h-80 object-contain mx-auto rounded-2xl" alt="preview" />
                        <button 
                            onClick={() => {setImageFile(null); setImagePreview(null)}} 
                            className="absolute top-6 right-6 bg-black/80 text-white p-2 rounded-full hover:bg-red-600 border border-white/10 transition-all shadow-xl"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
                    <button 
                        onClick={() => fileInputRef.current.click()} 
                        className="text-zinc-400 hover:text-blue-500 flex items-center gap-2.5 transition-all group"
                    >
                        <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-blue-500/10 transition-all">
                            <ImageIcon size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Add Media</span>
                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                    </button>
                    
                    <button 
                        onClick={handlePostTweet} 
                        className="bg-white text-black hover:bg-blue-50 px-10 py-3 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-lg transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Send size={14} /> Post
                    </button>
                </div>
            </div>

            {/* Tweets Feed */}
            <div className="space-y-8 pb-32">
                {tweets.map(t => (
                    <div key={t._id} className="bg-zinc-900/20 backdrop-blur-sm p-8 rounded-[3rem] border border-white/5 group relative shadow-2xl hover:bg-zinc-900/40 transition-all duration-500">
                        <div className="flex gap-6">
                            <img src={getSecureUrl(t.owner?.avatar || userData?.avatar)} className="w-14 h-14 rounded-[1.2rem] object-cover border-2 border-white/5 shadow-2xl" alt="user avatar" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-[13px] font-black uppercase italic tracking-tight text-white mb-1">
                                            {t.owner?.fullName || userData?.fullName}
                                        </h4>
                                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest lowercase">
                                            {t.createdAt ? formatDistanceToNow(new Date(t.createdAt), { addSuffix: true }).replace('about ', '') : "just now"}
                                        </p>
                                    </div>
                                    
                                    {userData?._id === (t.owner?._id || t.owner) && (
                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            <button onClick={() => {setEditingId(t._id); setEditContent(t.content)}} className="p-2 bg-white/5 rounded-xl hover:text-blue-500 transition-colors">
                                                <Edit3 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteTweet(t._id)} className="p-2 bg-white/5 rounded-xl hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {editingId === t._id ? (
                                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                        <textarea 
                                            className="w-full bg-black/40 border border-white/10 p-5 rounded-[1.5rem] text-zinc-200 outline-none focus:border-blue-500/50 transition-all font-medium" 
                                            value={editContent} 
                                            onChange={(e) => setEditContent(e.target.value)} 
                                        />
                                        <div className="flex gap-3 mt-4">
                                            <button onClick={() => handleUpdateTweet(t._id)} className="bg-blue-600 px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Save</button>
                                            <button onClick={() => setEditingId(null)} className="bg-zinc-800 px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-zinc-200 text-lg font-medium leading-relaxed mb-6 selection:bg-blue-500/50">{t.content}</p>
                                        
                                        {t.image && (
                                            <div className="mt-6 bg-black/40 rounded-[2.5rem] border border-white/5 p-4 group/img relative shadow-inner overflow-hidden">
                                                <img 
                                                    src={getSecureUrl(t.image)} 
                                                    className="w-full max-h-[500px] object-contain mx-auto block transition-transform duration-1000 hover:scale-[1.05]" 
                                                    alt="post content" 
                                                />
                                                {userData?._id === (t.owner?._id || t.owner) && (
                                                    <button 
                                                        onClick={() => handleRemoveImage(t._id)} 
                                                        className="absolute top-6 right-6 bg-red-600 text-[9px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full opacity-0 group-hover/img:opacity-100 transition-all shadow-2xl backdrop-blur-md border border-white/10"
                                                    >
                                                        Remove Media
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-8 mt-8 pt-6 border-t border-white/5">
                                            <button 
                                                onClick={() => handleToggleLike(t._id)}
                                                className="flex items-center gap-3 group/like transition-all"
                                            >
                                                <div className={`p-3 rounded-2xl transition-all ${t.isLiked ? "bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "bg-white/5 text-zinc-500 group-hover/like:bg-zinc-800 group-hover/like:text-white"}`}>
                                                    <Heart size={20} fill={t.isLiked ? "currentColor" : "none"} className="transition-transform group-active/like:scale-150" />
                                                </div>
                                                <span className={`text-[12px] font-black tracking-[0.2em] ${t.isLiked ? "text-red-500" : "text-zinc-500"}`}>
                                                    {t.likesCount || 0}
                                                </span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                {tweets.length === 0 && (
                    <div className="text-center py-40">
                        <p className="text-zinc-700 font-black uppercase tracking-[0.5em] italic">Feed Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Community;