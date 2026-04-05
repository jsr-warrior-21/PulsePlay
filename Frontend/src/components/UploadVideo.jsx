import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../api/axios'
import { Button, Input } from './index'

function UploadVideo() {
    const { register, handleSubmit, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const publishVideo = async (data) => {
        setLoading(true)
        setMessage("Uploading video... Please wait.")
        try {
            const formData = new FormData()
            formData.append("title", data.title)
            formData.append("description", data.description)
            formData.append("videoFile", data.videoFile[0])
            formData.append("thumbnail", data.thumbnail[0])

            const response = await axiosInstance.post("/videos/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            if (response.data) {
                setMessage("Video uploaded successfully!")
                reset()
            }
        } catch (error) {
            setMessage("Upload failed. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-8 bg-gray-900 text-white max-w-2xl mx-auto rounded-xl border border-gray-700'>
            <h2 className='text-2xl font-bold mb-6'>Upload Video</h2>
            <form onSubmit={handleSubmit(publishVideo)} className='space-y-6'>
                <Input label="Title" {...register("title", { required: true })} />
                <Input label="Description" {...register("description", { required: true })} />
                <Input label="Video File" type="file" accept="video/*" {...register("videoFile", { required: true })} />
                <Input label="Thumbnail" type="file" accept="image/*" {...register("thumbnail", { required: true })} />
                <Button type="submit" disabled={loading} className='w-full'>
                    {loading ? "Uploading..." : "Publish Video"}
                </Button>
                {message && <p className='text-center mt-4'>{message}</p>}
            </form>
        </div>
    )
}

export default UploadVideo