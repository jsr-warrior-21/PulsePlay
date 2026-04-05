import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import ReactPlayer from "react-player";
import { Container, Button } from "../components";

function VideoDetail() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    if (videoId) {
        setLoading(true);
        axiosInstance.get(`/videos/${videoId}`)
            .then((res) => {
                if (res.data?.message) {
                    let videoData = res.data.message;
                    
                    // Sabse important fix: HTTP ko HTTPS mein convert karna
                    if (videoData.videoFile && videoData.videoFile.startsWith("http://")) {
                        videoData.videoFile = videoData.videoFile.replace("http://", "https://");
                    }
                    if (videoData.owner?.avatar && videoData.owner.avatar.startsWith("http://")) {
                        videoData.owner.avatar = videoData.owner.avatar.replace("http://", "https://");
                    }

                    setVideo(videoData);
                }
            })
            .catch((err) => console.log("Fetch Error:", err))
            .finally(() => setLoading(false));
    }
}, [videoId]);

  if (loading)
    return (
      <div className="text-white text-center py-20">Loading Video Data...</div>
    );
  if (!video)
    return <div className="text-white text-center py-20">Video not found!</div>;

  return (
    <div className="w-full py-8 bg-gray-900 min-h-screen">
      <Container>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {/* Video Player Wrapper */}
            <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800">
             <ReactPlayer
    url={video?.videoFile}
    controls={true}  // Taaki aap play button daba sako
    playing={true}   // Auto-play koshish karega
    muted={true}     // Browser auto-play ke liye zaroori hai
    width='100%'
    height='100%'
/>
            </div>

            {/* Video Info */}
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-white">{video.title}</h1>
              <div className="flex items-center justify-between mt-4 p-4 bg-gray-800 rounded-xl">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      video.owner?.avatar || "https://via.placeholder.com/150"
                    }
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                    alt="avatar"
                  />
                  <div>
                    <p className="text-white font-bold text-lg">
                      {video.owner?.username || "Channel Name"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {video.views || 0} views
                    </p>
                  </div>
                  <Button className="bg-white text-black font-bold px-6 py-2 rounded-full hover:bg-gray-200 transition">
                    Subscribe
                  </Button>
                </div>
                <div className="flex gap-4">
                  <Button className="bg-gray-700 hover:bg-gray-600 px-6">
                    Like
                  </Button>
                  <Button className="bg-gray-700 hover:bg-gray-600 px-6">
                    Share
                  </Button>
                </div>
              </div>

              {/* Description Box */}
              <div className="mt-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
                <p className="text-gray-200 leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default VideoDetail;
