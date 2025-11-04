import { useEffect, useState } from "react";
import { IoBookOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { useAuthStore } from "../lib/authStore";
import Loader from "../Loaders/Loader";


const Hero = () => {
    const { user, loading ,logout } = useAuthStore();

    if (loading) {
        return <div><Loader /></div>;
    }


    const [menuOpen, setMenuOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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

    return (
        <>
            <div className="min-h-screen pb-20">
                {/* Navbar */}
                <nav className={` z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm ${scrolled ? "fixed top-0 bg-white/90 backdrop-blur-sm shadow-md" : "fixed top-0 bg-transparent"} transition-all duration-500 ease-in-out `}>
                    <a href="#" className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent">
                        GroundZero
                    </a>

                    <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                        <a
                            href="#"
                            className="hover:text-green-600 transition"
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            className="hover:text-green-600 transition"
                        >
                            About
                        </a>
                        <a
                            href="#how"
                            className="hover:text-green-600 transition"
                        >
                            How It Works
                        </a>
                        <a
                            href="#testimonials"
                            className="hover:text-green-600 transition"
                        >
                            Testimonials
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
                                    <p className="text-green-600 max-md:hidden font-bold uppercase">{user.username}</p>
                                </div>
                                <div>
                                    <button 
                                        className="bg-red-400 p-2 rounded-full text-white cursor-pointer"
                                        onClick={()=>logout()}
                                    >
                                            <IoMdLogOut/>
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

                {/* Mobile Menu */}
                <div
                    className={`fixed inset-0 z-[100] bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${
                        menuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <a href="#" className="text-white">
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
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-green-600 hover:bg-green-700 transition text-white rounded-md flex"
                    >
                        X
                    </button>
                </div>

                {/* Hero Section */}
                <div className="mt-15 relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black">
                    <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-green-300 blur-[100px] opacity-30"></div>

                    {/* Avatars + Stars */}
                    <div className="flex items-center mt-24">
                        <div className="flex -space-x-3 pr-3">
                            <img
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                                alt="user3"
                                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                                alt="user1"
                                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                                alt="user2"
                                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                                alt="user3"
                                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]"
                            />
                            <img
                                src="https://randomuser.me/api/portraits/men/75.jpg"
                                alt="user5"
                                className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[5]"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-gray-700">
                                Driven by people. Built for progress.
                            </p>
                        </div>
                    </div>

                    {/* Headline + CTA */}
                    <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]">
                        From broken roads to brighter communities — it all
                        begins at{" "}
                        <span className=" bg-gradient-to-br from-green-500 to-green-900 bg-clip-text text-transparent text-nowrap">
                            {" "}
                            GroundZero.
                        </span>
                    </h1>

                    <p className="max-w-md text-center text-base my-7">
                        Report issues, take action, and make real-world change —
                        all from one platform.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4 ">
                        <a
                            href="/"
                            className="bg-gradient-to-br from-green-500 to-green-800 hover:scale-102 transition-all duration-350 text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-green-400 flex items-center"
                        >
                            Get started
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-arrow-right ml-1 size-4"
                                aria-hidden="true"
                            >
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </a>
                        <a 
                            className="flex items-center gap-2 cursor-pointer border border-slate-400 hover:bg-green-50 transition rounded-full px-7 h-12 text-slate-700" 
                            href="#about"
                        >
                            <IoBookOutline className="text-xl" />
                            <span>Learn More</span>
                        </a>
                    </div>

                    {/* <p className="py-6 text-slate-600 mt-14">Trusting by leading brands, including</p>

                    <div className="flex flex-wrap justify-between max-sm:justify-center gap-6 max-w-3xl w-full mx-auto py-4" id="logo-container">
                        {logos.map((logo, index) => <img key={index} src={logo} alt="logo" className="h-6 w-auto max-w-xs" />)}
                    </div> */}
                </div>
                <div id="about"></div>
            </div>
        </>
    );
};

export default Hero;
