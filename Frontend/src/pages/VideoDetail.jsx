import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance, { getSecureUrl } from "../api/axios";
import ReactPlayer from "react-player";

function VideoDetail() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0); 
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0); 

  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  const fetchVideoData = useCallback(async () => {
    try {
      const videoRes = await axiosInstance.get(`/videos/${videoId}`);
      const data = videoRes.data.data;
      setVideo(data);
      setIsLiked(!!data.isLiked);
      setLikesCount(data.likesCount || 0); 
      setIsSubscribed(!!data.owner?.isSubscribed);
      setSubscriberCount(data.owner?.subscribersCount || 0);
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
  }, [videoId, userData, fetchVideoData, fetchComments]);

  const handleLike = async () => {
    if (!userData) return alert("Bhai login karo!");
    try {
      await axiosInstance.post(`/likes/toggle/video/${videoId}`);
      await fetchVideoData();
    } catch (err) { console.error(err); }
  };

  const handleSubscribe = async () => {
    if (!userData) return alert("Login required!");
    try {
      await axiosInstance.post(`/subscriptions/c/${video.owner._id}`);
      window.dispatchEvent(new Event("subscriptionChange"));
      await fetchVideoData();
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axiosInstance.post(`/comments/${videoId}`, { content: commentText });
      setComments(prev => [{ ...res.data.data, owner: userData, likesCount: 0, isLiked: false }, ...prev]);
      setCommentText("");
    } catch { alert("Comment failed!"); }
  };

  const handleCommentLike = async (commentId) => {
    if (!userData) return alert("Login to like!");
    try {
      const res = await axiosInstance.post(`/likes/toggle/comment/${commentId}`);
      fetchComments(); // Refresh comments to sync likes
    } catch (err) { console.error(err); }
  };

  if (!video) return <div className="text-white p-10 text-center animate-pulse font-bold">Loading PulsePlay...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto text-left p-4 min-h-screen text-white bg-[#0f0f0f]">
      <div className="flex-1">
        {/*  Player Section */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl border border-gray-800/40">
          <ReactPlayer url={getSecureUrl(video.videoFile)} controls width="100%" height="100%" playing={true} />
        </div>

        {/*  Info Section - Re-Aligned & Bigger */}
        <div className="mt-4">
          <h1 className="text-2xl font-extrabold tracking-tight leading-tight mb-2">{video.title}</h1>
          
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            {/* Left side: Views & Date (Parallel) */}
            <div className="flex items-center gap-2 text-[14px] text-zinc-400 font-bold">
              <span>{video.views.toLocaleString()} views</span>
              <span>•</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Right side: Actions (Bigger Icons) */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLike} 
                className={`flex items-center gap-2.5 px-5 py-2 rounded-full font-bold text-sm transition-all ${isLiked ? "bg-white text-black" : "bg-[#272727] hover:bg-[#3f3f3f]"}`}
              >
                <span className="text-xl">{isLiked ? "❤️" : "🤍"}</span> {likesCount}
              </button>
              <button 
                onClick={() => setShowPlaylistModal(true)} 
                className="bg-[#272727] hover:bg-[#3f3f3f] px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2"
              >
                <span className="text-xl">➕</span> Save
              </button>
            </div>
          </div>
        </div>

        {/*  Channel Section - Compact & Aligned */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <img src={getSecureUrl(video.owner?.avatar)} className="w-12 h-12 rounded-full object-cover border border-gray-800" />
            <div className="text-left">
              <p className="font-extrabold text-lg leading-tight">{video.owner?.fullName || video.owner?.username}</p>
              <p className="text-[13px] text-zinc-500 font-bold">{subscriberCount} subscribers</p>
            </div>
            <button 
              onClick={handleSubscribe} 
              className={`px-6 py-2 rounded-full font-bold text-sm ml-4 transition-all ${isSubscribed ? "bg-[#272727] text-zinc-400" : "bg-white text-black hover:bg-zinc-200"}`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>

        {/*  Comments Section - Tighter Spacing */}
        <div className="mt-8 border-t border-gray-800 pt-6">
          <h3 className="text-xl font-extrabold mb-6">{comments.length} Comments</h3>
          
          <div className="flex gap-4 mb-8 items-start">
            <img src={getSecureUrl(userData?.avatar)} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
              <input 
                className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-white outline-none text-base transition-all font-medium" 
                placeholder="Add a comment..." 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
              />
              <div className="flex justify-end mt-2">
                <button 
                  onClick={handleAddComment} 
                  className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-full font-bold text-xs"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-4">
                <img src={getSecureUrl(c.owner?.avatar)} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-zinc-200">
                    @{c.owner?.username} <span className="text-zinc-500 font-medium ml-2">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="text-[15px] text-zinc-300 mt-1 leading-snug">{c.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button 
                      onClick={() => handleCommentLike(c._id)}
                      className={`text-sm font-bold flex items-center gap-1.5 ${c.isLiked ? "text-blue-500" : "text-zinc-500 hover:text-white"}`}
                    >
                      {c.isLiked ? "💙" : "👍"} {c.likesCount || 0}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*  Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-[320px] shadow-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Save to playlist</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {playlists.map((p) => (
                <button 
                  key={p._id} 
                  onClick={() => axiosInstance.patch(`/playlists/add/${videoId}/${p._id}`).then(() => setShowPlaylistModal(false))} 
                  className="w-full flex items-center gap-3 p-3 hover:bg-[#272727] rounded-xl text-sm font-bold"
                >
                  📁 {p.name}
                </button>
              ))}
            </div>
            <button onClick={() => setShowPlaylistModal(false)} className="w-full mt-4 py-2 font-bold text-zinc-400">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoDetail;