import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useSelector } from 'react-redux';

function Playlists() {
    const [playlists, setPlaylists] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const userData = useSelector(state => state.auth.userData);

    const fetchPlaylists = async () => {
        if (!userData?._id) return;
        try {
            const res = await axiosInstance.get(`/playlists/user/${userData._id}`); // #21
            setPlaylists(res.data.data || []);
        } catch (err) {
            console.error("Fetch playlists error", err);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, [userData]);

    // --- Create Playlist Logic (#20) ---
    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        setLoading(true);
        try {
            await axiosInstance.post("/playlists", { 
                name, 
                description: description || "My amazing collection" 
            });
            setName("");
            setDescription("");
            setShowForm(false);
            fetchPlaylists(); // Refresh list
            alert("Playlist created successfully! 🔥");
        } catch (err) {
            alert("Bhai, playlist nahi ban payi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 text-left min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black text-white">Your Playlists</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition"
                >
                    {showForm ? "Cancel" : "+ New Playlist"}
                </button>
            </div>

            {/* 🆕 Create Playlist Form Section */}
            {showForm && (
                <div className="mb-10 bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800 shadow-xl animate-in fade-in zoom-in duration-300">
                    <form onSubmit={handleCreatePlaylist} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Playlist Name (e.g. My Favorites)" 
                            className="w-full bg-[#0f0f0f] border border-gray-700 p-4 rounded-xl outline-none focus:border-blue-500 transition"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <textarea 
                            placeholder="Description (Optional)" 
                            className="w-full bg-[#0f0f0f] border border-gray-700 p-4 rounded-xl outline-none focus:border-blue-500 transition"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="2"
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Now"}
                        </button>
                    </form>
                </div>
            )}

            {/* 📁 Playlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {playlists.length > 0 ? playlists.map(p => (
                    <div key={p._id} className="group bg-[#1a1a1a] rounded-3xl border border-gray-800 p-5 hover:border-blue-600 transition shadow-lg cursor-pointer flex flex-col h-full">
                        <div className="w-full aspect-video bg-[#272727] rounded-2xl flex items-center justify-center text-5xl mb-4 group-hover:bg-[#333] transition-colors relative overflow-hidden">
                            📁
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm font-bold">
                                VIEW PLAYLIST
                            </div>
                        </div>
                        <h2 className="font-bold text-xl truncate text-white">{p.name}</h2>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-1">{p.description || "No description"}</p>
                        <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-800/50">
                            <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">
                                {p.videos?.length || 0} videos
                            </span>
                            <span className="text-gray-600 text-[10px]">
                                {new Date(p.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center bg-[#1a1a1a] rounded-3xl border-2 border-dashed border-gray-800">
                        <p className="text-gray-500 text-lg">Please create a Playlist</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Playlists;