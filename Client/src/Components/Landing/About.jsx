import { TbUsersGroup } from "react-icons/tb";
import { BsLightningCharge } from "react-icons/bs";
import { SiTicktick } from "react-icons/si";
import { RiTimeZoneLine } from "react-icons/ri";
import { LuHandHeart } from "react-icons/lu";
import { HiMiniFire } from "react-icons/hi2";

export default function About() {
    return (
        <div className="mb-5 flex flex-col items-center -mt-10">
            <h1 className="landing-header">About GroundZero</h1>
            <p className="landing-subheader">
                Empowering real people to solve real problems — one community, one action at a time.
            </p>
            <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 px-8 md:px-0 pt-16">
                <div className="size-[520px] -top-80 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10 bg-[#FBFFE1]"></div>
                <div className="about-card">
                    <div className="size-10 p-2 bg-gradient-to-br from-emerald-300 to-emerald-500  rounded text-emerald-900 shadow-md drop-shadow-md drop-shadow-emerald-300">
                        <TbUsersGroup className="text-xl"/>   
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Community-Powered Impact</h3>
                        <p className="text-sm text-slate-500">Every action starts with you. Collaborate with people who care and bring real change where it’s needed most.</p>
                    </div>
                </div>
                <div className="about-card">
                    <div className="size-10 p-2 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded text-yellow-900 shadow-md drop-shadow-md drop-shadow-yellow-300">
                        <BsLightningCharge className="text-xl"/>     
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Lightning-Fast Issue Reporting</h3>
                        <p className="text-sm text-slate-500">Report local issues instantly — no complexity, no delay. Just tap, submit, and make your voice heard.</p>
                    </div>
                </div>
                <div className="about-card">
                    <div className="size-10 p-2 bg-gradient-to-br from-sky-300 to-sky-500 rounded text-sky-900 shadow-md drop-shadow-md drop-shadow-sky-300">
                        <SiTicktick className="text-xl"/>    
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Verified Issue Tracking</h3>
                        <p className="text-sm text-slate-500">Every report is verified and tracked, ensuring authenticity and accountability from start to finish.</p>
                    </div>
                </div>
                <div className="about-card">
                    <div className="size-10 p-2 bg-gradient-to-br from-violet-300 to-violet-500 rounded text-violet-900 shadow-md drop-shadow-md drop-shadow-violet-300">
                        <RiTimeZoneLine className="text-xl"/>
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Real-Time Updates</h3>
                        <p className="text-sm text-slate-500">Stay informed as your community acts. Track progress, completion, and contributions in real-time.</p>
                    </div>
                </div>
                <div className="about-card">
                    <div className="size-10 p-2 bg-gradient-to-br from-rose-300 to-rose-500 rounded text-rose-900 shadow-md drop-shadow-md drop-shadow-rose-300">
                        <LuHandHeart className="text-xl"/>
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Designed for Everyone</h3>
                        <p className="text-sm text-slate-500">Built with inclusivity and simplicity — accessible for all, from rural users to city changemakers.</p>
                    </div>
                </div>
                <div className="about-card">
                    <div className="size-10 p-2 bg-gradient-to-br from-orange-300 to-orange-500 rounded text-orange-900 shadow-md drop-shadow-md drop-shadow-orange-300">
                        <HiMiniFire className="text-xl"/>
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-600">Built for Change</h3>
                        <p className="text-sm text-slate-500">GroundZero isn’t just an app — it’s a movement. A platform where ideas meet action and change begins from the ground up.</p>
                    </div>
                </div>
            </div>
            <div id="how"></div>
        </div>
    );
};