import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuthStore } from "../lib/authStore";
import Loader from "../Loaders/Loader";
import { IoMdLogOut } from "react-icons/io";
import { useLocation } from "react-router-dom";

const Navbar = () => {

    const location = useLocation();

    const isHome = location.pathname === '/';

    const [menuOpen, setMenuOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    const { user, logout } = useAuthStore();

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
    }, []);

    if(isHome){
        return <div>
            <nav
                className={` z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm ${
                    scrolled
                        ? "fixed top-0 bg-white/90 backdrop-blur-sm shadow-md"
                        : "fixed top-0 bg-transparent"
                } transition-all duration-500 ease-in-out `}
            >
                <a
                    href="/"
                    className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent"
                >
                    GroundZero
                </a>

                <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                    <a href="/" className="hover:text-green-600 transition">
                        Home
                    </a>
                    <a
                        href="#about"
                        className="hover:text-green-600 transition"
                    >
                        About
                    </a>
                    <a href="#how" className="hover:text-green-600 transition">
                        How It Works
                    </a>
                    <a
                        href="#testimonials"
                        className="hover:text-green-600 transition"
                    >
                        Testimonials
                    </a>
                    <a
                        href="/issues"
                        className="hover:scale-102 transition text-transparent bg-gradient-to-r from-green-500 to-green-800 bg-clip-text font-bold"
                    >
                        Explore Issues
                    </a>
                </div>

                <div className="flex gap-2">
                    {user ? (
                        <>
                            <div className="flex flex-wrap justify-center gap-2 items-center">
                                <div className="relative">
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={user.profile_image}
                                        alt="userImage1"
                                    />
                                </div>
                                <p className="text-green-600 max-md:hidden font-bold uppercase">
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
                        </>
                    ) : (
                        <>
                            <a
                                href="/register"
                                className="hidden md:block px-6 py-2 bg-gradient-to-br from-green-500 to-green-800 hover:scale-103 active:scale-95 transition-all rounded-full text-white"
                            >
                                Get started
                            </a>
                            <a
                                href="/login"
                                className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900"
                            >
                                Login
                            </a>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setMenuOpen(true)}
                    className="md:hidden active:scale-90 transition"
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

            <div
                className={`fixed inset-0 z-[100] bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <a href="/" className="text-white">
                    Home
                </a>
                <a href="#about" className="text-white">
                    About
                </a>
                <a href="#how" className="text-white">
                    How It Works
                </a>
                <a href="#testimonials" className="text-white">
                    Testimonials
                </a>
                <a
                    href="/issues"
                    className="hover:scale-102 transition text-transparent bg-gradient-to-r from-green-400 to-green-500 bg-clip-text font-bold"
                >
                    Explore Issues
                </a>
                <button
                    onClick={() => setMenuOpen(false)}
                    className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-green-600 hover:bg-green-700 transition text-white rounded-md flex"
                >
                    X
                </button>
            </div>
        </div>
    }

    return (
        <div>
            <nav
                className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm fixed top-0 bg-white shadow-md"
            >
                <a
                    href="/"
                    className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent"
                >
                    GroundZero
                </a>

                <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                    <a href="/" className="hover:text-green-600 transition">
                        Home
                    </a>
                    <a
                        href="/issues"
                        className="hover:scale-102 transition text-transparent bg-gradient-to-r from-green-500 to-green-800 bg-clip-text font-bold"
                    >
                        Explore Issues
                    </a>
                </div>

                <div className="flex gap-2">
                    {user ? (
                        <>
                            <div className="flex flex-wrap justify-center gap-2 items-center">
                                <div className="relative">
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={user.profile_image}
                                        alt="userImage1"
                                    />
                                </div>
                                <p className="text-green-600 max-md:hidden font-bold uppercase">
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
                        </>
                    ) : (
                        <>
                            <a
                                href="/register"
                                className="hidden md:block px-6 py-2 bg-gradient-to-br from-green-500 to-green-800 hover:scale-103 active:scale-95 transition-all rounded-full text-white"
                            >
                                Get started
                            </a>
                            <a
                                href="/login"
                                className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900"
                            >
                                Login
                            </a>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setMenuOpen(true)}
                    className="md:hidden active:scale-90 transition"
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

            <div
                className={`fixed inset-0 z-[100] bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <a href="/" className="text-white">
                    Home
                </a>
                <a
                    href="/issues"
                    className="hover:scale-102 transition text-transparent bg-gradient-to-r from-green-400 to-green-500 bg-clip-text font-bold"
                >
                    Explore Issues
                </a>
                <button
                    onClick={() => setMenuOpen(false)}
                    className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-green-600 hover:bg-green-700 transition text-white rounded-md flex"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default Navbar;
