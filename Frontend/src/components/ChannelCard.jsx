export default function ChannelCard({ channel }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-white rounded shadow hover:shadow-md transition">
      <img src={channel.avatar} alt={channel.username} className="w-12 h-12 rounded-full object-cover" />
      <div>
        <p className="font-semibold">{channel.fullName}</p>
        <p className="text-sm text-gray-500">@{channel.username}</p>
      </div>
    </div>
  );
}