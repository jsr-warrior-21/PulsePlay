import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { Container, VideoCard } from "../components";

function Home() {
  // 1. Initial state hamesha empty array rakho []
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/videos")
        .then((res) => {
            console.log("CHECKING PATH:", res.data.message.docs); // Ye check karo
            if (res.data && res.data.message) {
                // Aapka data 'message' key ke andar 'docs' mein hai
                setVideos(res.data.message.docs || []);
            }
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
}, []);

  if (loading)
    return (
      <div className="text-white text-center py-20">Loading Videos...</div>
    );

  if (!videos || videos.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <h1 className="text-2xl font-bold text-white">
            No videos found. Login to upload!
          </h1>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {videos.map((video) => (
            <div key={video._id} className="p-2 w-1/4">
              <VideoCard {...video} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
