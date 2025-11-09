

export default function HowItWorks() {
    return (
        <div className="mt-20 mb-20 flex flex-col items-center ">
            <div className="mb-20">
                <h1 className="landing-header">How GroundZero Works</h1>
                <p className="landing-subheader">From report to resolve — experience the RRR that powers GroundZero.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="size-[520px] top-0 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10 bg-[#FBFFE1]/70"></div>
                <div className="how-card">
                    <div className="p-2 aspect-square bg-gradient-to-br from-violet-300 to-violet-500 rounded-full shadow-md shadow-violet-900/60">
                        <p className="text-2xl text-center text-violet-900 font-extrabold">1</p>
                    </div>
                    <div className="mt-5 space-y-2 text-center">
                        <h3 className="text-base font-semibold text-slate-700">Report</h3>
                        <p className="text-sm text-slate-600">Spot a local issue? Snap a photo, write a short note, and submit it in seconds.
Your report puts a spotlight on problems that need attention — from potholes to pollution.</p>
                    </div>
                </div>
                <div className="how-card">
                    <div className="p-2 aspect-square bg-gradient-to-br from-green-300 to-green-500 rounded-full shadow-md shadow-green-900/60">
                        <p className="text-2xl text-center text-green-900 font-extrabold">2</p>
                    </div>
                    <div className="mt-5 space-y-2 text-center">
                        <h3 className="text-base font-semibold text-slate-700">Rally</h3>
                        <p className="text-sm text-slate-600">Once reported, the community rallies.
People, volunteers, and changemakers come together to plan, act, and push for progress.</p>
                    </div>
                </div>
                <div className="how-card">
                    <div className="p-2 aspect-square bg-gradient-to-br from-orange-300 to-orange-500 rounded-full shadow-md shadow-orange-900/60">
                        <p className="text-2xl text-center text-orange-900 font-extrabold">3</p>
                    </div>
                    <div className="mt-5 space-y-2 text-center">
                        <h3 className="text-base font-semibold text-slate-700">Resolve</h3>
                        <p className="text-sm text-slate-600">Watch the impact unfold.
Track progress, see updates, and celebrate when your issue gets resolved — powered by collective effort.</p>
                    </div>
                </div>
            </div>
            <div id="testimonials"></div>
        </div>
    );
};