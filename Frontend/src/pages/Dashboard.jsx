import { useEffect, useState } from "react";
import API from "../api/api";
import VideoCard from "../components/VideoCard";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => setDashboard(res.data.data))
      .catch(console.log);
  }, []);

  if (!dashboard) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-4">Dashboard</h2>
      <p>Total Views: {dashboard.stats.totalViews}</p>
      <p>Total Videos: {dashboard.stats.totalVideos}</p>
      <p>Total Likes: {dashboard.stats.totalLikes}</p>
      <p>Total Subscribers: {dashboard.stats.totalSubscribers}</p>

      <h3 className="mt-4 font-semibold">Your Videos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        {dashboard.videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}