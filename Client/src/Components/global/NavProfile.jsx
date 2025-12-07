import React from "react";
import { useAuthStore } from "../../lib/authStore";
import { IoMdLogOut } from "react-icons/io";
import { Badge } from "primereact/badge";

const NavProfile = ({op,unreadAnnouncements}) => {
    const {user,logout} = useAuthStore();
    return (
        <div className="bg-gradient-to-br from-green-500 to-green-800 flex items-center gap-3 px-3 py-2 rounded-full text-white">
            <div
                className="flex flex-wrap justify-center gap-2 items-center cursor-pointer"
                onClick={(e) => op.current.toggle(e)}
            >
                
                <div className="relative p-overlay-badge">
                    <img
                        className="h-7 w-7 rounded-full "
                        src={user.profile_image}
                        alt="userImage1"
                        style={{ fontSize: '2rem' }}
                    />
                    {unreadAnnouncements > 0 && (
                        <Badge value={unreadAnnouncements} severity="danger"></Badge>
                    )}
                </div>
                <p className="max-md:hidden font-bold uppercase">
                    {user.username}
                </p>
            </div>
            <div>
                <button
                    className="bg-red-400 p-2 rounded-full text-white cursor-pointer"
                    onClick={() => logout()}
                >
                    <IoMdLogOut />
                </button>
            </div>
            
        </div>
    );
};

export default NavProfile;
