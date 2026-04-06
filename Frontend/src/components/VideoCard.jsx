export default function VideoCard({ video }) {
  return (
    <div className="bg-white rounded shadow p-2 hover:shadow-md transition">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="font-semibold mt-2">{video.title}</h3>
      <p className="text-sm text-gray-500">{video.views} views</p>
    </div>
  );
}