import { useEffect, useState } from "react";
import API from "../api/api";
import VideoCard from "../components/VideoCard";

export default function Profile({ userId }) {
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    API.get(`/dashboard/${userId}`).then((res) => {
      setVideos(res.data.data.videos);
      setStats(res.data.data.stats);
    });
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-2">Profile</h2>
      <p>Total Views: {stats.totalViews}</p>
      <p>Total Videos: {stats.totalVideos}</p>
      <p>Total Likes: {stats.totalLikes}</p>
      <p>Total Subscribers: {stats.totalSubscribers}</p>

      <h3 className="mt-4 font-semibold">Videos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
}