import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, History, LayoutDashboard, LayoutGrid } from 'lucide-react';

function MobileNav() {
    const navItems = [
        { name: "Home", path: "/", icon: <Home size={22} /> },
        { name: "Community", path: "/community", icon: <Users size={22} /> },
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={22} /> },
        { name: "History", path: "/history", icon: <History size={22} /> },
        { name: "Playlist", path: "/playlists", icon: <LayoutGrid size={22} /> },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/5 flex justify-around items-center z-50 px-1 h-[65px] pb-0 mb-0 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
            {navItems.map((item) => (
                <NavLink 
                    key={item.name}
                    to={item.path}
                    className={({isActive}) => `flex flex-col items-center justify-center h-full w-full gap-1 transition-all ${isActive ? "text-blue-500" : "text-zinc-500"}`}
                >
                    {item.icon}
                    <span className="text-[9px] font-medium tracking-tight italic">
                        {item.name}
                    </span>
                </NavLink>
            ))}
        </nav>
    );
}
export default MobileNav;