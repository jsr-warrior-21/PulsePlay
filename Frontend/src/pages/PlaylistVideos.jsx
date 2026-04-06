import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import VideoCard from '../components/VideoCard';

function PlaylistVideos() {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");

    const fetchPlaylistData = async () => {
        try {
            const res = await axiosInstance.get(`/playlists/${playlistId}`);
            if (res.data?.success) {
                setPlaylist(res.data.data);
                setNewName(res.data.data.name);
                setNewDesc(res.data.data.description);
            }
        } catch (err) {
            console.error("Error fetching playlist", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (playlistId) fetchPlaylistData();
    }, [playlistId]);

    const handleDeletePlaylist = async () => {
        if (window.confirm("Are you sure you want to delete this entire playlist?")) {
            try {
                await axiosInstance.delete(`/playlists/${playlistId}`);
                alert("Playlist deleted successfully");
                navigate("/playlists");
            } catch (err) {
                alert("Failed to delete playlist");
            }
        }
    };

    const handleUpdatePlaylist = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.patch(`/playlists/${playlistId}`, {
                name: newName,
                description: newDesc
            });
            alert("Playlist updated!");
            setIsEditing(false);
            fetchPlaylistData();
        } catch (err) {
            alert("Failed to update playlist");
        }
    };

    const handleRemoveVideo = async (videoId) => {
        if (window.confirm("Remove this video?")) {
            try {
                await axiosInstance.patch(`/playlists/remove/${videoId}/${playlistId}`);
                fetchPlaylistData();
            } catch (err) {
                alert("Failed to remove video");
            }
        }
    };

    if (loading) return <div className="p-20 text-center text-white font-black italic uppercase animate-pulse">Loading Playlist...</div>;

    return (
        <div className="flex-1 bg-[#0f0f0f] min-h-screen text-white p-4 md:p-8 text-left">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-10 border-b border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    {!isEditing ? (
                        <div className="flex-1">
                            <h1 className="text-5xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                                {playlist?.name}
                                <button onClick={() => setIsEditing(true)} className="text-[10px] text-blue-500 font-black uppercase tracking-widest border border-blue-500/30 px-3 py-1 rounded-full hover:bg-blue-500 hover:text-white transition-all">Edit</button>
                            </h1>
                            <p className="text-zinc-500 mt-2 font-medium max-w-2xl">{playlist?.description || "No description provided."}</p>
                            <div className="flex items-center gap-4 mt-4">
                                <p className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-900/20">
                                    {playlist?.videos?.filter(v => v !== null).length || 0} Videos
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePlaylist} className="flex-1 flex flex-col gap-3 max-w-md bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800">
                            <input 
                                type="text" 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl outline-none focus:border-blue-500 font-bold"
                                placeholder="Playlist Name"
                            />
                            <textarea 
                                value={newDesc} 
                                onChange={(e) => setNewDesc(e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl outline-none focus:border-blue-500 h-24 resize-none"
                                placeholder="Description"
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 px-6 py-2 rounded-full text-[10px] font-black uppercase">SAVE CHANGES</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase">CANCEL</button>
                            </div>
                        </form>
                    )}

                    <button 
                        onClick={handleDeletePlaylist}
                        className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-8 py-3 rounded-full text-[10px] font-black uppercase border border-red-600/50 transition-all shadow-lg active:scale-95"
                    >
                        Delete Playlist
                    </button>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {playlist?.videos?.filter(v => v !== null).map(v => (
                        <div key={v._id} className="relative group">
                            {/* 🔥 FIXED PROP PASSING HERE */}
                            <VideoCard video={v} />
                            
                            {/* Remove Video Button Overlay */}
                            <button 
                                onClick={() => handleRemoveVideo(v._id)}
                                className="absolute top-2 right-2 bg-black/90 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-2xl border border-white/10 z-10"
                                title="Remove from playlist"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {(!playlist?.videos || playlist.videos.filter(v => v !== null).length === 0) && (
                    <div className="py-32 text-center border-2 border-dashed border-zinc-800 rounded-[3rem] bg-[#141414]/50">
                        <span className="text-5xl mb-4 block opacity-20">📁</span>
                        <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-sm italic">This playlist is empty</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlaylistVideos;