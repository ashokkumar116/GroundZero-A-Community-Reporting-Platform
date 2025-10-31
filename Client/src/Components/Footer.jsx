const Footer = () => {

        const linkSections = [
        {
            title: "Explore",
            links: ["Home", "How It Works", "Community Stories", "Join as Volunteer", "Contact Us"]
        },
        {
            title: "Resources",
            links: ["Report an Issue", "Our Mission", "Terms & Conditions", "Privacy Policy", "Support Center"]
        },
        {
            title: "Connect",
            links: ["Instagram", "LinkedIn", "Twitter", "YouTube"]
        }
        ];


    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-20 bg-gray-100/30">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <h1 className="text-3xl font-bold text-primary">GroundZero</h1>
                    <p className="max-w-[410px] mt-6">GroundZero is where real change begins.
We empower people to report local issues, collaborate with volunteers, and drive grassroots impact that transforms communities from the ground up.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:underline transition">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
  © {new Date().getFullYear()} GroundZero. All Rights Reserved.  
  Built with ❤️ for a better tomorrow.
</p>
        </div>
    );
};

export default Footer;