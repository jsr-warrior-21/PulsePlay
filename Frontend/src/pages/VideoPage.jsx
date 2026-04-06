import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import VideoCard from "../components/VideoCard";
import CommentCard from "../components/CommentCard";

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    API.get(`/videos/${id}`).then((res) => setVideo(res.data.data));
    API.get(`/comments/${id}`).then((res) => setComments(res.data.data.docs));
  }, [id]);

  const handleComment = () => {
    if (!newComment.trim()) return;
    API.post(`/comments/${id}`, { content: newComment }).then((res) => {
      setComments([res.data.data, ...comments]);
      setNewComment("");
    });
  };

  const handleLike = () => {
    API.post(`/likes/toggle/video/${id}`).then((res) => {
      setIsLiked(res.data.data.isLiked);
    });
  };

  if (!video) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <VideoCard video={video} />
      <button
        onClick={handleLike}
        className={`mt-2 px-4 py-1 rounded ${
          isLiked ? "bg-red-500 text-white" : "bg-gray-300"
        }`}
      >
        {isLiked ? "Unlike" : "Like"}
      </button>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Comments</h3>
        <div className="flex gap-2 mb-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="border p-1 flex-1"
          />
          <button
            onClick={handleComment}
            className="bg-blue-500 text-white px-3 rounded"
          >
            Post
          </button>
        </div>
        {comments.map((c) => (
          <CommentCard key={c._id} comment={c} />
        ))}
      </div>
    </div>
  );
}