import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuthStore } from "../../lib/authStore";
import { useLocation } from "react-router-dom";
import ProfileOverlayPanel from "../Overlays/ProfileOverlayPanel";
import { OverlayPanel } from "primereact/overlaypanel";
import { HomeMenuItems, OtherPageMenuItems } from "../../../Contents/constants";
import NavProfile from "./NavProfile";
import NavStarted from "./NavStarted";

const Navbar = () => {

    const location = useLocation();
    const isAdminPanel = location.pathname.startsWith('/admin');
    


    const isHome = location.pathname === '/';

    const [scrolled, setScrolled] = useState(false);

    const { user , loading} = useAuthStore();


    const op = useRef(null);
    const menu = useRef(null);


    useEffect(() => {
        if(!isHome) return;
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isHome]);


        if (loading) return null;

        const userId = user?._id;

        if(isAdminPanel){
            return null;
        }

    if(isHome){
        return (
            <div>
                <ProfileOverlayPanel panelRef={op} userId={userId} key={userId ?? "nouser"}/>
                <nav
                    className={` z-50 flex items-center justify-around lg:justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm transition-all duration-500 ease-in-out 
                        ${scrolled
                                ? "fixed top-0 bg-white/90 backdrop-blur-sm shadow-md"
                                : "fixed top-0 bg-transparent"
                    }`}
                >
                    <a
                        href="/"
                        className=""
                    >
                        <img src="/navlogo.png" alt="" className="h-10" />
                    </a>

                    <div className="hidden lg:flex items-center gap-8 transition duration-500 text-slate-800">
                        {
                            HomeMenuItems.map((item,index)=>(
                                <a href={item.link} key={index}className="hover:text-green-600 transition">
                                    {item.name}
                                </a>
                            ))
                        }
                    </div>

                    <div className="flex gap-2">
                        {user ? (
                            <NavProfile op={op} />
                        ) : (
                            <NavStarted />
                        )}
                    </div>

                    <button
                        onClick={(e)=>menu.current.toggle(e)}
                        className="lg:hidden active:scale-90 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="lucide lucide-menu"
                        >
                            <path d="M4 5h16M4 12h16M4 19h16" />
                        </svg>
                    </button>
                </nav>
                <OverlayPanel ref={menu}>
                    <div className="flex flex-col items-start">
                        {
                            HomeMenuItems.map((item,index)=>(
                                <a href={item.link} key={index}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    {item.name}
                                </a>
                            ))
                        }
                    </div>
                </OverlayPanel>
            </div>
        )
    }

    return (
        <div>
            <ProfileOverlayPanel panelRef={op} userId={userId} key={userId ?? "nouser"} />
            <nav
                className="z-50 flex items-center justify-around lg:justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm fixed top-0 bg-white shadow-md"
            >
                <a
                    href="/"
                    className=""
                >
                    <img src="/navlogo.png" alt="" className="h-10" />
                </a>

                <div className="hidden lg:flex items-center gap-8 transition duration-500 text-slate-800">
                    {
                        OtherPageMenuItems.map((item,index)=>{
                            return (
                                <a href={item.link} key={index}className="hover:text-green-600 transition cursor-pointer">
                                    {item.name}
                                </a>
                            )
                        })
                    }
                </div>

                <div className="flex gap-2">
                    {user ? (
                        <NavProfile op={op} />
                    ) : (
                        <NavStarted />
                    )}
                </div>

                <button
                    onClick={(e)=>menu.current.toggle(e)}
                    className="lg:hidden active:scale-90 transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="lucide lucide-menu"
                    >
                        <path d="M4 5h16M4 12h16M4 19h16" />
                    </svg>
                </button>
            </nav>

            <OverlayPanel
                ref={menu}
            >
                <div className="flex flex-col items-start">
                    {
                        OtherPageMenuItems.map((item,index)=>(
                            <a href={item.link} key={index}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                {item.name}
                            </a>
                        ))
                    }
                </div>
            </OverlayPanel>
        </div>
    );
};

export default Navbar;
