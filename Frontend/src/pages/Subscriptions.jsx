import { useEffect, useState } from "react";
import API from "../api/api";
import ChannelCard from "../components/ChannelCard";

export default function Subscriptions() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    API.get("/subscriptions/me").then((res) => setChannels(res.data.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-4">Subscribed Channels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((c) => (
          <ChannelCard key={c._id} channel={c} />
        ))}
        {channels.length === 0 && <p>No subscriptions yet</p>}
      </div>
    </div>
  );
}