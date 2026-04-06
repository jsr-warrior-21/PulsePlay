import { useEffect, useState } from "react";
import API from "../api/api";
import VideoCard from "../components/VideoCard";

export default function LikedVideos() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    API.get("/likes/videos").then((res) => setVideos(res.data.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-4">Liked Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
        {videos.length === 0 && <p>You haven't liked any videos yet</p>}
      </div>
    </div>
  );
}