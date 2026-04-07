import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance, { getSecureUrl } from "../api/axios";
import VideoCard from "../components/VideoCard"; 

function VideoDetail() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [suggestedVideos, setSuggestedVideos] = useState([]); 
  const [commentText, setCommentText] = useState("");
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0); 
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0); 

  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const fixVideoUrl = (url) => {
    if (!url) return "";
    let secureUrl = getSecureUrl(url);
    if (secureUrl.includes("/image/upload/")) {
      return secureUrl.replace("/image/upload/", "/video/upload/");
    }
    return secureUrl;
  };

  const fetchVideoData = useCallback(async () => {
    try {
      const videoRes = await axiosInstance.get(`/videos/${videoId}`);
      const data = videoRes.data.data;
      setVideo(data);
      setIsLiked(!!data.isLiked);
      setLikesCount(data.likesCount || 0); 
      setIsSubscribed(!!data.owner?.isSubscribed);
      setSubscriberCount(data.owner?.subscribersCount || 0);
      
      const suggestionsRes = await axiosInstance.get(`/videos`);
      const allVideos = suggestionsRes.data.data.docs || suggestionsRes.data.data;
      const filtered = allVideos.filter(v => v._id.toString() !== videoId.toString());
      setSuggestedVideos(filtered);
    } catch (error) { console.error(error); }
  }, [videoId]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/comments/${videoId}`);
      setComments(res.data.data || []);
    } catch (err) { console.error(err); }
  }, [videoId]);

  useEffect(() => {
    if (videoId) {
      fetchVideoData();
      fetchComments();
      if (userData) {
        axiosInstance.get(`/playlists/user/${userData._id}`).then(res => setPlaylists(res.data.data || []));
      }
    }
    window.scrollTo(0, 0); 
  }, [videoId, userData, fetchVideoData, fetchComments]);

  // Logic functions (Same as before)
  const handleLike = async () => {
    if (!userData) return alert("Login please!");
    try {
      await axiosInstance.post(`/likes/toggle/video/${videoId}`);
      await fetchVideoData();
    } catch (err) { console.error(err); }
  };

  const handleSubscribe = async () => {
    if (!userData) return alert("Login required!");
    try {
      await axiosInstance.post(`/subscriptions/c/${video.owner._id}`);
      await fetchVideoData();
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axiosInstance.post(`/comments/${videoId}`, { content: commentText });
      const newComment = { ...res.data.data, owner: userData, likesCount: 0, isLiked: false };
      setComments(prev => [newComment, ...prev]);
      setCommentText("");
    } catch { alert("Comment failed!"); }
  };

  const handleCommentLike = async (commentId) => {
    if (!userData) return alert("Login required!");
    try {
      const res = await axiosInstance.post(`/likes/toggle/comment/${commentId}`);
      const { isLiked } = res.data.data;
      setComments(prev => prev.map(c => c._id === commentId ? { ...c, isLiked, likesCount: isLiked ? (c.likesCount || 0) + 1 : Math.max(0, (c.likesCount || 1) - 1) } : c));
    } catch (err) { console.error(err); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete?")) return;
    try {
      await axiosInstance.delete(`/comments/c/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch { alert("Delete failed!"); }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      await axiosInstance.patch(`/comments/c/${commentId}`, { content: editingText });
      setComments(prev => prev.map(c => c._id === commentId ? { ...c, content: editingText } : c));
      setEditingCommentId(null);
    } catch { alert("Update failed!"); }
  };

  if (!video) return <div className="text-white p-10 text-center animate-pulse font-bold">Loading PulsePlay...</div>;

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      <div className="max-w-[1550px] mx-auto flex flex-col lg:flex-row gap-6 p-4">
        
        <div className="flex-1 lg:max-w-[calc(100%-400px)]">
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/5">
            <video 
              key={videoId} // Re-mount when video changes
              src={fixVideoUrl(video.videoFile)} 
              poster={getSecureUrl(video.thumbnail)}
              controls 
              autoPlay 
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Info */}
          <div className="mt-4">
            <h1 className="text-xl md:text-2xl font-black mb-3 leading-tight">{video.title}</h1>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div className="flex items-center gap-4">
                <img src={getSecureUrl(video.owner?.avatar)} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" alt="avatar" />
                <div className="text-left">
                  <p className="font-bold text-base md:text-lg">{video.owner?.fullName || video.owner?.username}</p>
                  <p className="text-[12px] text-zinc-500 font-bold">{subscriberCount} subscribers</p>
                </div>
                <button onClick={handleSubscribe} className={`px-5 py-2 rounded-full font-bold text-sm ml-2 transition-all ${isSubscribed ? "bg-zinc-800 text-zinc-400" : "bg-white text-black hover:bg-zinc-200"}`}>
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${isLiked ? "bg-white text-black" : "bg-zinc-800 hover:bg-zinc-700"}`}>
                  <span>{isLiked ? "❤️" : "🤍"}</span> {likesCount}
                </button>
                <button onClick={() => setShowPlaylistModal(true)} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                  <span>➕</span> Save
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-zinc-900/50 rounded-xl text-left">
               <p className="text-sm font-bold">{video.views.toLocaleString()} views • {new Date(video.createdAt).toLocaleDateString()}</p>
               <p className="text-sm text-zinc-300 mt-2 line-clamp-3">{video.description}</p>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-8 text-left">
            <h3 className="text-xl font-black mb-6 uppercase italic tracking-tighter">{comments.length} Comments</h3>
            <div className="flex gap-3 mb-8">
              <img src={getSecureUrl(userData?.avatar)} className="w-10 h-10 rounded-full object-cover" alt="me" />
              <div className="flex-1">
                <input className="w-full bg-transparent border-b border-zinc-700 py-1.5 focus:border-white outline-none text-sm transition-all font-medium" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                <div className="flex justify-end mt-2">
                  <button onClick={handleAddComment} className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-full font-bold text-xs">Comment</button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {comments.map((c) => (
                <div key={c._id} className="flex gap-3">
                  <img src={getSecureUrl(c.owner?.avatar)} className="w-9 h-9 rounded-full object-cover shrink-0" alt="user" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold">@{c.owner?.username}</p>
                      <span className="text-zinc-500 text-[10px]">{new Date(c.createdAt).toLocaleDateString()}</span>
                      {userData?._id === c.owner?._id && (
                        <div className="flex gap-2 text-[10px] font-bold text-zinc-600 ml-auto uppercase tracking-tighter">
                          <button onClick={() => { setEditingCommentId(c._id); setEditingText(c.content); }} className="hover:text-white">Edit</button>
                          <button onClick={() => handleDeleteComment(c._id)} className="hover:text-red-500">Delete</button>
                        </div>
                      )}
                    </div>
                    {editingCommentId === c._id ? (
                      <div className="mt-1">
                        <input className="w-full bg-zinc-900 border-b border-blue-500 py-1 outline-none text-xs" value={editingText} onChange={(e) => setEditingText(e.target.value)} autoFocus />
                        <div className="flex gap-2 mt-1 justify-end">
                          <button onClick={() => setEditingCommentId(null)} className="text-[9px] font-bold text-zinc-500">Cancel</button>
                          <button onClick={() => handleUpdateComment(c._id)} className="text-[9px] font-bold text-blue-500">Save</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[14px] text-zinc-300 mt-1">{c.content}</p>
                    )}
                    <button onClick={() => handleCommentLike(c._id)} className={`mt-2 text-[11px] font-bold flex items-center gap-1 ${c.isLiked ? "text-blue-500" : "text-zinc-500"}`}>
                       <span>{c.isLiked ? "💙" : "👍"}</span> {c.likesCount || 0}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="lg:w-[400px] flex flex-col gap-4 text-left">
           <h4 className="text-sm font-black uppercase italic text-zinc-500 tracking-widest border-b border-zinc-800 pb-2 mb-2">Up Next</h4>
           {suggestedVideos.map((v) => (
             <div key={v._id} className="scale-95 origin-left hover:scale-100 transition-transform">
                <VideoCard video={v} />
             </div>
           ))}
        </div>

      </div>

      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-[320px] shadow-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4 italic uppercase">Save to...</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {playlists.map((p) => (
                <button key={p._id} onClick={() => axiosInstance.patch(`/playlists/add/${videoId}/${p._id}`).then(() => setShowPlaylistModal(false))} className="w-full flex items-center gap-3 p-3 hover:bg-[#272727] rounded-xl text-sm font-bold uppercase tracking-tighter">📁 {p.name}</button>
              ))}
            </div>
            <button onClick={() => setShowPlaylistModal(false)} className="w-full mt-4 py-2 font-bold text-zinc-400 text-xs">CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoDetail;