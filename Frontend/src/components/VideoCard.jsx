import React from 'react'
import { Link } from 'react-router-dom'

function VideoCard({ _id, title, thumbnail, owner, views }) {
  return (
    <Link to={`/video/${_id}`}>
        <div className='w-full bg-gray-800 rounded-xl p-4 h-full hover:bg-gray-700 duration-200'>
            <div className='w-full justify-center mb-4'>
                <img src={thumbnail} alt={title} className='rounded-xl object-cover h-40 w-full' />
            </div>
            <h3 className='text-xl font-bold text-white line-clamp-1'>{title}</h3>
            <p className='text-gray-400 text-sm'>@{owner?.username}</p>
            <p className='text-gray-400 text-xs'>{views} views</p>
        </div>
    </Link>
  )
}
export default VideoCard