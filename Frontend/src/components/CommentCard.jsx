import { Link } from "react-router-dom";

export default function VideoCard({ video }) {
  return (
    <div className="border p-2 rounded shadow-md">
      <Link to={`/video/${video._id}`}>
        <video
          src={video.videoFile}
          poster={video.thumbnail}
          controls
          className="w-full rounded"
        />
      </Link>
      <h3 className="font-semibold mt-2">{video.title}</h3>
      <p className="text-sm text-gray-600">{video.description}</p>
      <p className="text-xs text-gray-500">
        Views: {video.views} | Duration: {video.duration}s
      </p>
    </div>
  );
}