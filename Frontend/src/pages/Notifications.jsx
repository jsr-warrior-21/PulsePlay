import { useEffect, useState } from "react";
import API from "../api/api";
import NotificationItem from "../components/NotificationItem";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = () => {
    API.get("/notifications").then((res) => {
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = () => {
    API.post("/notifications/mark-all-read").then(() => {
      fetchNotifications();
    });
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-2">Notifications ({unreadCount} unread)</h2>
      <button
        onClick={markAllRead}
        className="mb-2 bg-blue-500 text-white px-3 py-1 rounded"
      >
        Mark all as read
      </button>
      <div>
        {notifications.map((n) => (
          <NotificationItem key={n._id} notification={n} />
        ))}
        {notifications.length === 0 && <p>No notifications yet</p>}
      </div>
    </div>
  );
}