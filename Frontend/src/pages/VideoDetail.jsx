import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../api/axios'
import ReactPlayer from 'react-player'
import { Container, Button } from '../components'

function VideoDetail() {
    const { videoId } = useParams()
    const [video, setVideo] = useState(null)
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {
        if (videoId) {
            axiosInstance.get(`/videos/${videoId}`).then((res) => {
                if (res.data) setVideo(res.data.data)
            })
        }
    }, [videoId])

    const handleSubscribe = async () => {
        try {
            const response = await axiosInstance.post(`/subscriptions/c/${video?.owner?._id}`)
            if (response.data) setIsSubscribed(!isSubscribed)
        } catch (error) {
            console.error("Subscription toggle failed", error)
        }
    }

    if (!video) return <div className='text-white text-center py-20'>Loading Video...</div>

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-col lg:flex-row gap-6'>
                    <div className='flex-1'>
                        <div className='relative pt-[56.25%] bg-black rounded-xl overflow-hidden'>
                            <ReactPlayer
                                url={video.videoFile}
                                controls
                                width='100%'
                                height='100%'
                                className='absolute top-0 left-0'
                                playing
                            />
                        </div>
                        <div className='mt-4'>
                            <h1 className='text-2xl font-bold text-white'>{video.title}</h1>
                            <div className='flex items-center justify-between mt-4 p-4 bg-gray-800 rounded-xl'>
                                <div className='flex items-center gap-4'>
                                    <img src={video.owner?.avatar} className='w-12 h-12 rounded-full object-cover' alt='avatar' />
                                    <div>
                                        <p className='text-white font-bold'>{video.owner?.username}</p>
                                        <p className='text-gray-400 text-sm'>Subscribers count</p>
                                    </div>
                                    <Button 
                                        onClick={handleSubscribe}
                                        className={isSubscribed ? 'bg-gray-600' : 'bg-white text-black'}
                                    >
                                        {isSubscribed ? "Subscribed" : "Subscribe"}
                                    </Button>
                                </div>
                                <div className='flex gap-4'>
                                    <Button className='bg-gray-700'>Like</Button>
                                </div>
                            </div>
                            <div className='mt-4 p-4 bg-gray-800 rounded-xl'>
                                <p className='text-gray-300'>{video.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default VideoDetail