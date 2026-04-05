import React, {useEffect, useState} from 'react'
import axiosInstance from '../api/axios'
import {Container, VideoCard} from '../components'

function Home() {
    const [videos, setVideos] = useState([])

    useEffect(() => {
        axiosInstance.get("/videos").then((res) => {
            if (res.data) {
                setVideos(res.data.data.docs) // Paginated data hai toh docs mein hoga
            }
        })
    }, [])
  
    if (videos.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500 text-white">
                                Login to read posts or no videos found
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {videos.map((video) => (
                        <div key={video._id} className='p-2 w-1/4'>
                            <VideoCard {...video} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home