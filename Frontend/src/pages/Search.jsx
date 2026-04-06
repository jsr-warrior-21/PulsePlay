import { useState } from "react";
import API from "../api/api";
import VideoCard from "../components/VideoCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    if (!query.trim()) return;
    API.get(`/search?query=${query}`).then((res) => setResults(res.data.data));
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-xl mb-2">Search Videos</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for videos..."
          className="border p-1 flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
        {results.length === 0 && <p>No results found</p>}
      </div>
    </div>
  );
}