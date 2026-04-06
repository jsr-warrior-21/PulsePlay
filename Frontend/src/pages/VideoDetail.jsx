import React, { useEffect, useState } from "react";
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
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Playlist states
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const videoRes = await axiosInstance.get(`/videos/${videoId}`);
        const videoData = videoRes.data.data;
        setVideo(videoData);
        setIsLiked(videoData.isLiked);
        setIsSubscribed(videoData.owner?.isSubscribed);

        const commentRes = await axiosInstance.get(`/comments/${videoId}`);
        setComments(commentRes.data.data || []);

        // Fetch user playlists for the "Save" feature
        if (userData) {
          const plRes = await axiosInstance.get(
            `/playlists/user/${userData._id}`,
          );
          setPlaylists(plRes.data.data || []);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchVideoData();
  }, [videoId, userData]);

  // --- Like/Subscribe Logic ---
  const handleLike = async () => {
    try {
      const res = await axiosInstance.post(`/likes/toggle/video/${videoId}`);
      setIsLiked(res.data.data.isLiked);
    } catch (err) {
      alert("Login required!");
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await axiosInstance.post(
        `/subscriptions/c/${video.owner._id}`,
      );
      setIsSubscribed(res.data.data.isSubscribed);
    } catch (err) {
      alert("Action failed!");
    }
  };

  // --- Comment Logic ---
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axiosInstance.post(`/comments/${videoId}`, {
        content: commentText,
      });
      const newComment = {
        ...res.data.data,
        owner: {
          _id: userData._id,
          username: userData.username,
          avatar: userData.avatar,
        },
      };
      setComments([newComment, ...comments]);
      setCommentText("");
    } catch (err) {
      alert("Fail!");
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bhai, comment uda du?")) return;
    try {
      await axiosInstance.delete(`/comments/c/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert("Delete failed!");
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      await axiosInstance.post(`/likes/toggle/comment/${commentId}`); // #33
      alert("Comment Liked!");
    } catch (err) {
      console.error(err);
    }
  };

  // --- Playlist Logic ---
  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axiosInstance.patch(`/playlists/add/${videoId}/${playlistId}`); // #23
      alert("Video added to playlist! 🔥");
      setShowPlaylistModal(false);
    } catch (err) {
      alert("Already in playlist or error!");
    }
  };

  if (!video)
    return (
      <div className="text-white p-20 text-center animate-pulse">
        Loading PulsePlay...
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto text-left p-4 relative">
      <div className="flex-1">
        {/* 📺 Video Player */}
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <ReactPlayer
            url={getSecureUrl(video.videoFile)}
            controls
            width="100%"
            height="100%"
            playing={true}
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-between items-start gap-4">
          <h1 className="text-2xl font-black">{video.title}</h1>
          <button
            onClick={() => setShowPlaylistModal(true)}
            className="bg-[#272727] hover:bg-[#3f3f3f] px-6 py-2 rounded-full font-bold flex items-center gap-2 transition"
          >
            ➕ Save to Playlist
          </button>
        </div>

        {/* Channel & Stats */}
        <div className="flex flex-wrap items-center justify-between mt-4 bg-[#1a1a1a] p-4 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-4">
            <img
              src={getSecureUrl(video.owner?.avatar)}
              className="w-12 h-12 rounded-full border border-blue-600 object-cover"
              alt="avatar"
            />
            <div>
              <p className="font-bold">{video.owner?.fullName}</p>
              <p className="text-xs text-gray-400">{video.views} views</p>
            </div>
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full font-bold ml-4 transition ${isSubscribed ? "bg-gray-700" : "bg-white text-black"}`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition ${isLiked ? "bg-blue-600" : "bg-[#272727]"}`}
          >
            {isLiked ? "👍 Liked" : "👍 Like"}
          </button>
        </div>

        {/* 💬 Comment Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">{comments.length} Comments</h3>
          <div className="flex gap-4 mb-8">
            <input
              className="flex-1 bg-transparent border-b border-gray-700 py-2 focus:border-blue-500 outline-none transition"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-600 px-6 py-2 rounded-full font-bold text-sm"
            >
              Comment
            </button>
          </div>

          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-4 group relative">
                <img
                  src={getSecureUrl(c.owner?.avatar)}
                  className="w-10 h-10 rounded-full object-cover bg-gray-800"
                  alt=""
                />
                <div className="flex-1">
                  <p className="text-sm font-bold">
                    @{c.owner?.username}{" "}
                    <span className="text-gray-500 text-xs ml-2">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-sm mt-1 text-gray-300">{c.content}</p>
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => handleCommentLike(c._id)}
                      className="text-xs text-gray-500 hover:text-blue-500 transition"
                    >
                      👍 Like
                    </button>
                    {userData?._id === c.owner?._id && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-xs text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📺 Suggested Videos */}
      <div className="w-full lg:w-[400px]">
        <h3 className="font-bold mb-4 text-gray-400 uppercase text-xs tracking-widest">
          Suggested Videos
        </h3>
        <p className="text-gray-600 text-sm italic italic">
          More videos coming soon...
        </p>
      </div>

      {/* 📁 Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1a1a1a] p-6 rounded-3xl w-full max-w-sm border border-gray-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Save to Playlist</h2>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="text-gray-400"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {playlists.length > 0 ? (
                playlists.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => handleAddToPlaylist(p._id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-[#272727] rounded-xl transition text-left"
                  >
                    <span className="text-xl">📁</span>
                    <span className="font-medium">{p.name}</span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No playlists found. Create one first!
                </p>
              )}
            </div>
            <button
              onClick={() => setShowPlaylistModal(false)}
              className="w-full mt-6 py-3 bg-[#272727] rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoDetail;
