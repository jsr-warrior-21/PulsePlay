import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Playlists() {
    const [playlists, setPlaylists] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const userData = useSelector(state => state.auth.userData);
    const navigate = useNavigate();

    const fetchPlaylists = async () => {
        if (!userData?._id) return;
        try {
            const res = await axiosInstance.get(`/playlists/user/${userData._id}`);
            setPlaylists(res.data.data || []);
        } catch (err) {
            console.error("Fetch playlists error", err);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, [userData]);

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
            fetchPlaylists();
            alert("Playlist created successfully!");
        } catch (err) {
            alert("Failed to create playlist. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 text-left min-h-screen bg-[#0f0f0f] text-white">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black uppercase tracking-tighter italic">Your Playlists</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-white text-black px-6 py-2 rounded-full font-black text-sm hover:bg-gray-200 transition-all shadow-lg"
                >
                    {showForm ? "CANCEL" : "+ NEW PLAYLIST"}
                </button>
            </div>

            {showForm && (
                <div className="mb-10 bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800 shadow-2xl animate-in fade-in zoom-in duration-300">
                    <form onSubmit={handleCreatePlaylist} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Playlist Name (e.g. My Favorites)" 
                            className="w-full bg-[#0f0f0f] border border-gray-700 p-4 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <textarea 
                            placeholder="Description (Optional)" 
                            className="w-full bg-[#0f0f0f] border border-gray-700 p-4 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="2"
                        />
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 shadow-lg"
                        >
                            {loading ? "CREATING..." : "CREATE NOW"}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
                {playlists.length > 0 ? playlists.map(p => {
                    const validVideosCount = p.videos?.filter(v => v !== null).length || 0;

                    return (
                        <div 
                            key={p._id} 
                            onClick={() => navigate(`/playlist/${p._id}`)}
                            className="group bg-[#1a1a1a] rounded-[2.5rem] border border-gray-800 p-5 hover:border-blue-600 transition-all shadow-xl cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
                        >
                            <div className="w-full aspect-video bg-[#272727] rounded-[1.5rem] flex items-center justify-center text-5xl mb-4 group-hover:bg-[#333] transition-colors relative overflow-hidden shadow-inner">
                                📁
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white text-xs font-black tracking-widest border-b-2 border-white pb-1">VIEW VIDEOS</span>
                                </div>
                            </div>
                            <h2 className="font-black text-xl truncate text-white uppercase tracking-tight">{p.name}</h2>
                            <p className="text-gray-500 text-sm mt-2 line-clamp-2 font-medium leading-relaxed">{p.description || "No description provided"}</p>
                            
                            <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-800/50 mt-4">
                                <div className="flex flex-col">
                                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">
                                        {validVideosCount} {validVideosCount === 1 ? 'video' : 'videos'}
                                    </span>
                                </div>
                                <span className="text-gray-600 text-[9px] font-bold uppercase">
                                    Updated: {new Date(p.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )
                }) : (
                    <div className="col-span-full py-24 text-center bg-[#1a1a1a]/50 rounded-[3rem] border-2 border-dashed border-gray-800">
                        <div className="text-5xl mb-4 opacity-20">📂</div>
                        <p className="text-gray-500 text-lg font-bold uppercase tracking-widest">Your playlist library is empty</p>
                        <p className="text-gray-700 text-sm mt-2">Click '+ New Playlist' to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Playlists;