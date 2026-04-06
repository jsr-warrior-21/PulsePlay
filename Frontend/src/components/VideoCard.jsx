import React from 'react';
import { Link } from 'react-router-dom';
import { getSecureUrl } from '../api/axios';

function VideoCard(props) {
    // Handling direct props {...v} or wrapped props video={v}
    const data = props.video || props;

    // Safety Check
    if (!data._id && !props._id) return null;

    const { _id, thumbnail, title, views, owner, createdAt } = data;

    return (
        <Link 
            to={`/video/${_id}`} 
            className="group flex flex-col gap-2.5 transition-all duration-300 w-full rounded-3xl p-2 hover:bg-[#1a1a1a]"
        >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800/60 shadow-inner group-hover:border-gray-700 transition-all flex items-center justify-center">
                {thumbnail ? (
                    <img 
                        src={getSecureUrl(thumbnail)} 
                        alt={title} 
                        className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-500 ease-out block" 
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-800 animate-pulse" />
                )}
                
            </div>

            <div className="flex gap-3 px-1.5 mt-1">
                <div className="w-9 h-9 shrink-0 mt-0.5">
                    <img 
                        src={getSecureUrl(owner?.avatar)} 
                        className="w-full h-full rounded-full object-cover border border-zinc-700 shadow-md bg-zinc-800" 
                        alt="avatar" 
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150" }}
                    />
                </div>

                <div className="text-left flex-1 min-w-0">
                    <h3 className="font-bold text-[13.5px] line-clamp-2 leading-tight text-gray-100 group-hover:text-white transition-colors tracking-tight">
                        {title}
                    </h3>
                    <div className="mt-1 space-y-0.5">
                        <p className="text-[12px] font-medium text-gray-400 hover:text-white transition-colors truncate">
                            {owner?.fullName || owner?.username || "Unknown Channel"}
                        </p>
                        <p className="text-[11px] font-bold text-zinc-500 flex items-center gap-1">
                            <span>{(views || 0).toLocaleString()} views</span>
                            <span>•</span>
                            <span>{createdAt ? new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "Just now"}</span>
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default VideoCard;