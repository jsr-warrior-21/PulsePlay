import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import ReactPlayer from "react-player";
import { Container, Button } from "../components";

function VideoDetail() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false); // Like state handle karne ke liye

  useEffect(() => {
    if (videoId) {
      setLoading(true);
      axiosInstance
        .get(`/videos/${videoId}`)
        .then((res) => {
          // Dashboard ki tarah yahan bhi message/data check lagaya hai
          const responseContent = res.data?.message || res.data?.data;

          if (responseContent) {
            let data;
            if (Array.isArray(responseContent)) {
              data = responseContent.find((v) => v._id === videoId) || responseContent[0];
            } else {
              data = responseContent;
            }

            if (data && data.videoFile) {
              data.videoFile = data.videoFile.replace("http://", "https://");
              setVideo(data);
              setIsLiked(data.isLiked || false); // Backend se liked status milta hai toh
            }
          }
        })
        .catch((err) => console.error("Video Fetch Error:", err))
        .finally(() => setLoading(false));
    }
  }, [videoId]);

  // --- LIKE LOGIC ---
  const toggleLike = async () => {
    try {
      const res = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      setIsLiked(!isLiked);
      console.log("Like Status Updated", res.data);
    } catch (err) {
      alert("Login please to like!");
    }
  };

  // --- SUBSCRIBE LOGIC ---
  const toggleSubscribe = async () => {
    try {
      if (!video?.owner?._id) return;
      await axiosInstance.post(`/subscriptions/c/${video.owner._id}`);
      alert("Subscription Updated!");
    } catch (err) {
      alert("Subscription error!");
    }
  };

  if (loading)
    return (
      <div className="text-white text-center py-20 text-xl font-bold italic animate-pulse">
        PulsePlay is loading video...
      </div>
    );

  if (!video)
    return (
      <div className="text-white text-center py-20 text-xl">
        Bhai, ye video nahi mil rahi!
      </div>
    );

  return (
    <div className="w-full py-8 bg-[#0f0f0f] min-h-screen text-white">
      <Container>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 text-left">
            {/* Player Container */}
            <div className="relative pt-[56.25%] bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-blue-900/10">
              <ReactPlayer
                key={video._id}
                url={video.videoFile}
                className="absolute top-0 left-0"
                width="100%"
                height="100%"
                controls={true}
                playing={false}
                muted={true}
                playsinline={true}
                config={{
                  file: {
                    attributes: {
                      preload: "auto",
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              
              <div className="flex flex-wrap items-center justify-between mt-4 p-4 bg-[#1a1a1a] rounded-2xl border border-gray-800">
                <div className="flex items-center gap-4">
                  <img
                    src={video.owner?.avatar || `https://ui-avatars.com/api/?name=${video.owner?.username || "U"}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                    alt="avatar"
                  />
                  <div className="text-left">
                    <p className="font-bold text-lg leading-tight">
                      {video.owner?.username || "Channel Owner"}
                    </p>
                    <p className="text-gray-400 text-sm">{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 sm:mt-0">
                  {/* LIKE BUTTON */}
                  <button 
                    onClick={toggleLike}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition ${isLiked ? 'bg-blue-600 text-white' : 'bg-[#272727] text-white hover:bg-gray-700'}`}
                  >
                    {isLiked ? "👍 Liked" : "👍 Like"}
                  </button>

                  {/* SUBSCRIBE BUTTON */}
                  <Button 
                    onClick={toggleSubscribe}
                    className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Description Box */}
              <div className="mt-4 p-5 bg-[#1a1a1a] rounded-2xl border border-gray-800 text-gray-300">
                <h3 className="text-white font-bold mb-2">Description</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{video.description || "No description provided."}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default VideoDetail;