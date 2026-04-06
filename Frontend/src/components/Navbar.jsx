import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <Link to="/" className="font-bold text-lg">VideoPlayStation</Link>
      <div className="flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/subscriptions">Subscriptions</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/search">Search</Link>
        <Link to="/liked">Liked Videos</Link>
      </div>
    </nav>
  );
}