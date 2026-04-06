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

    // 1. Delete Playlist Fix
    const handleDeletePlaylist = async () => {
        if (window.confirm("Are you sure you want to delete this entire playlist?")) {
            try {
                // Ensure route matches your backend: /playlists/:playlistId
                await axiosInstance.delete(`/playlists/${playlistId}`);
                alert("Playlist deleted successfully");
                navigate("/playlists");
            } catch (err) {
                alert("Failed to delete playlist");
            }
        }
    };

    // 2. Edit Playlist Name/Desc Fix
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

    // 3. Remove Video Fix
    const handleRemoveVideo = async (videoId) => {
        if (window.confirm("Remove this video?")) {
            try {
                // Route check: /playlists/remove/:videoId/:playlistId
                await axiosInstance.patch(`/playlists/remove/${videoId}/${playlistId}`);
                fetchPlaylistData();
            } catch (err) {
                alert("Failed to remove video");
            }
        }
    };

    if (loading) return <div className="p-20 text-center text-white italic">Loading...</div>;

    return (
        <div className="flex-1 bg-[#0f0f0f] min-h-screen text-white p-4 md:p-8 text-left">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-10 border-b border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    {!isEditing ? (
                        <div className="flex-1">
                            <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                                {playlist?.name}
                                <button onClick={() => setIsEditing(true)} className="text-sm text-blue-500 font-bold uppercase tracking-widest border-b border-blue-500">Edit</button>
                            </h1>
                            <p className="text-zinc-500 mt-2 font-medium">{playlist?.description}</p>
                            <p className="text-blue-600 text-xs font-black mt-3 uppercase tracking-widest">
                                {/* Count Fix: Filter out any null values before counting */}
                                {playlist?.videos?.filter(v => v !== null).length || 0} Videos
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePlaylist} className="flex-1 flex flex-col gap-3 max-w-md">
                            <input 
                                type="text" 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg outline-none focus:border-blue-500"
                                placeholder="Playlist Name"
                            />
                            <textarea 
                                value={newDesc} 
                                onChange={(e) => setNewDesc(e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg outline-none focus:border-blue-500"
                                placeholder="Description"
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 px-4 py-1 rounded-full text-xs font-bold">SAVE</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="bg-zinc-800 px-4 py-1 rounded-full text-xs font-bold">CANCEL</button>
                            </div>
                        </form>
                    )}

                    <button 
                        onClick={handleDeletePlaylist}
                        className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-6 py-2 rounded-full text-xs font-black uppercase border border-red-600 transition-all"
                    >
                        Delete Playlist
                    </button>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {playlist?.videos?.filter(v => v !== null).map(v => (
                        <div key={v._id} className="relative group">
                            <VideoCard {...v} />
                            <button 
                                onClick={() => handleRemoveVideo(v._id)}
                                className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {(!playlist?.videos || playlist.videos.length === 0) && (
                    <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                        <p className="text-zinc-600 font-black uppercase tracking-widest">Playlist is empty</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlaylistVideos;