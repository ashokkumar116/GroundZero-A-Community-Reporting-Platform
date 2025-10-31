const Testimonials = () => {
    const cardsData = [
        {
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
            name: "Briar Martin",
            handle: "@briarmartin",
            date: "April 20, 2025",
            message:
                "GroundZero completely transformed how we organize and track local issues. It’s more than a platform — it’s a movement for real change.",
        },
        {
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
            name: "Avery Johnson",
            handle: "@averywrites",
            date: "May 10, 2025",
            message:
                "The simplicity and community-driven approach of GroundZero blew me away. Reporting and resolving local problems has never been this easy.",
        },
        {
            image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
            name: "Jordan Lee",
            handle: "@jordantalks",
            date: "June 5, 2025",
            message:
                "I joined as a volunteer and ended up making lifelong connections. GroundZero is where collaboration truly meets impact.",
        },
        {
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=60",
            name: "Sophia Ramirez",
            handle: "@sophiarise",
            date: "July 14, 2025",
            message:
                "Every time I use GroundZero, I feel like I’m contributing to something bigger. It empowers ordinary people to create extraordinary results.",
        },
        {
            image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
            name: "Ethan Walker",
            handle: "@ethanbuilds",
            date: "August 3, 2025",
            message:
                "I’ve used many social platforms, but none made this much real-world difference. GroundZero is a spark for genuine grassroots change.",
        },
    ];

    const CreateCard = ({ card }) => (
        <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0">
            <div className="flex gap-2">
                <img
                    className="size-11 rounded-full"
                    src={card.image}
                    alt="User Image"
                />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <p>{card.name}</p>
                        <svg
                            className="mt-0.5"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z"
                                fill="#2196F3"
                            />
                        </svg>
                    </div>
                    <span className="text-xs text-slate-500">
                        {card.handle}
                    </span>
                </div>
            </div>
            <p className="text-sm py-4 text-gray-800">{card.message}</p>
            <div className="flex items-center justify-between text-slate-500 text-xs">
                <div className="flex items-center gap-1">
                    <span>Posted on</span>
                    <a
                        href="https://x.com"
                        target="_blank"
                        className="hover:text-sky-500"
                    >
                        <svg
                            width="11"
                            height="10"
                            viewBox="0 0 11 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="m.027 0 4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0zM1.44.688h1.504l6.64 8.624H8.082z"
                                fill="currentColor"
                            />
                        </svg>
                    </a>
                </div>
                <p>{card.date}</p>
            </div>
        </div>
    );

    return (
        <>
            <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }

            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>

            <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
                <div className="mt-10 mb-10 flex flex-col items-center justify-center gap-2">
                    <div class="flex items-center gap-2 text-indigo-600 bg-indigo-50 rounded-full px-3 py-1">
                        <svg
                            width="13"
                            height="14"
                            viewBox="0 0 13 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.613 8.2a.62.62 0 0 1-.553-.341.59.59 0 0 1 .076-.637l6.048-6.118a.31.31 0 0 1 .375-.069c.061.033.11.084.137.147a.3.3 0 0 1 .014.197L6.537 4.991a.59.59 0 0 0 .07.552.61.61 0 0 0 .504.257h4.276a.62.62 0 0 1 .553.341.59.59 0 0 1-.076.637l-6.048 6.119a.31.31 0 0 1-.375.067.295.295 0 0 1-.15-.344l1.172-3.61a.59.59 0 0 0-.07-.553.61.61 0 0 0-.504-.257z"
                                stroke="#1E4BAF"
                                stroke-miterlimit="5.759"
                                stroke-linecap="round"
                            />
                        </svg>
                        <span>Testimonials</span>
                    </div>
                    <div>
                        <h1 className="landing-header">Voices of Change</h1>
                    <p className="landing-subheader">
                        Discover what our community members, volunteers, and
                        changemakers say about GroundZero. Every story is a
                        reflection of real impact — powered by people who
                        believe in making a difference from the ground up.
                    </p>
                    </div>
                </div>
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>

                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>

            <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative mb-20">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>
        </>
    );
};

export default Testimonials;
