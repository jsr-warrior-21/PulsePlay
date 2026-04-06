import React from 'react';
import { Link } from 'react-router-dom';
import { getSecureUrl } from '../api/axios';

function VideoCard({ _id, thumbnail, title, views, owner, createdAt }) {
    return (
        <Link to={`/video/${_id}`} className="group flex flex-col gap-2">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
                <img src={getSecureUrl(thumbnail)} alt={title} className="object-cover w-full h-full group-hover:scale-105 transition duration-300" />
            </div>
            <div className="flex gap-3 p-1">
                <img src={getSecureUrl(owner?.avatar)} className="w-9 h-9 rounded-full object-cover shrink-0" alt="avatar" />
                <div className="text-left">
                    <h3 className="font-bold text-sm line-clamp-2 leading-snug">{title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{owner?.fullName || owner?.username}</p>
                    <p className="text-xs text-gray-400">{views} views • {new Date(createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;