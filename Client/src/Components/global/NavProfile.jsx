import React from "react";
import { useAuthStore } from "../../lib/authStore";
import { IoMdLogOut } from "react-icons/io";

const NavProfile = ({op}) => {
    const {user,logout} = useAuthStore();
    return (
        <div className="bg-gradient-to-br from-green-500 to-green-800 flex items-center gap-3 px-3 py-2 rounded-full text-white">
            <div
                className="flex flex-wrap justify-center gap-2 items-center cursor-pointer"
                onClick={(e) => op.current.toggle(e)}
            >
                <div className="relative">
                    <img
                        className="h-7 w-7 rounded-full"
                        src={user.profile_image}
                        alt="userImage1"
                    />
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
