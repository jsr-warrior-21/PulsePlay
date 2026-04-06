import React, { useState } from 'react'
import axiosInstance from '../api/axios'
import { useNavigate } from 'react-router-dom'

function AddVideo() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ title: "", description: "" })
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const data = new FormData()
        data.append("title", formData.title)
        data.append("description", formData.description)
        data.append("videoFile", videoFile)
        data.append("thumbnail", thumbnail)

        try {
            await axiosInstance.post("/videos", data) 
            alert("Video uploaded successfully!")
            navigate("/")
        } catch (error) {
            alert("Upload failed!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-[#1a1a1a] rounded-3xl border border-gray-800 text-left">
            <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Video File</label>
                    <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} className="w-full bg-[#0f0f0f] p-3 rounded-xl border border-gray-700" required />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Thumbnail</label>
                    <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} className="w-full bg-[#0f0f0f] p-3 rounded-xl border border-gray-700" required />
                </div>
                <input 
                    type="text" placeholder="Title" 
                    className="w-full bg-[#0f0f0f] p-4 rounded-xl border border-gray-700 outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, title: e.target.value})} required 
                />
                <textarea 
                    placeholder="Description" rows="4"
                    className="w-full bg-[#0f0f0f] p-4 rounded-xl border border-gray-700 outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, description: e.target.value})} required
                ></textarea>
                <button 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg disabled:opacity-50"
                >
                    {loading ? "Uploading... Please wait" : "Publish Video"}
                </button>
            </form>
        </div>
    )
}

export default AddVideo