export default function NotificationItem({ notification }) {
  return (
    <div className={`p-2 mb-1 rounded ${notification.isRead ? 'bg-gray-100' : 'bg-blue-100'}`}>
      {notification.type === "comment" && (
        <p>
          <strong>{notification.fromUser?.username}</strong> commented: {notification.comment?.content}
        </p>
      )}
      {notification.type === "video_like" && (
        <p>
          <strong>{notification.fromUser?.username}</strong> liked your video: {notification.video?.title}
        </p>
      )}
      {notification.type === "comment_like" && (
        <p>
          <strong>{notification.fromUser?.username}</strong> liked your comment
        </p>
      )}
      {notification.type === "subscription" && (
        <p>
          <strong>{notification.fromUser?.username}</strong> subscribed to your channel
        </p>
      )}
    </div>
  );
}