import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axiosInstance, { getSecureUrl } from "../api/axios";
import { useSelector } from "react-redux";

function Sidebar() {
  const [subs, setSubs] = useState([]);
  const { status, userData } = useSelector((state) => state.auth);

  // Sidebar.jsx mein useEffect ka fetch function
  const fetchSubscriptions = async () => {
    if (status && userData?._id) {
      try {
        const res = await axiosInstance.get(`/subscriptions/u/${userData._id}`);
        // Agar backend response mein 'subscribedChannel' ke andar data hai:
        setSubs(res.data.data || []);
      } catch (err) {
        console.error("Sidebar fetch error", err);
      }
    }
  };

  useEffect(() => {
    fetchSubscriptions();

    window.addEventListener("subscriptionChange", fetchSubscriptions);

    return () => {
      window.removeEventListener("subscriptionChange", fetchSubscriptions);
    };
  }, [status, userData]);

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-[#0f0f0f] border-r border-gray-800 p-4 text-left overflow-y-auto no-scrollbar">
      <div className="space-y-2 mb-10">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-xl ${isActive ? "bg-[#1a1a1a] font-bold" : "hover:bg-[#1a1a1a]"}`
          }
        >
          🏠 Home
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-xl ${isActive ? "bg-[#1a1a1a] font-bold" : "hover:bg-[#1a1a1a]"}`
          }
        >
          🐦 Community
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-xl ${isActive ? "bg-[#1a1a1a] font-bold" : "hover:bg-[#1a1a1a]"}`
          }
        >
          🕒 History
        </NavLink>
        <NavLink
          to="/playlists"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-xl ${isActive ? "bg-[#1a1a1a] font-bold" : "hover:bg-[#1a1a1a]"}`
          }
        >
          📁 Playlists
        </NavLink>
      </div>

      {status && (
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase px-3 mb-4 tracking-tighter">
            Subscriptions
          </h3>
          <div className="space-y-2">
            {subs.map((channel) => (
              <NavLink
                key={channel._id}
                to={`/channel/${channel.username}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl ${isActive ? "bg-[#272727]" : "hover:bg-[#1a1a1a]"}`
                }
              >
                <img
                  src={getSecureUrl(channel.avatar)}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm truncate font-medium">
                  {channel.fullName}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
export default Sidebar;
