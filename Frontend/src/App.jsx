import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import VideoPage from "./pages/VideoPage";
import Notifications from "./pages/Notifications";
import Subscriptions from "./pages/Subscriptions";
import LikedVideos from "./pages/LikedVideos";
import Search from "./pages/Search";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/liked" element={<LikedVideos />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}