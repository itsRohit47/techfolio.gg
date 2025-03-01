import { LineChartIcon, PaletteIcon, LinkIcon, GlobeIcon, SearchIcon, MoonIcon, LightbulbIcon } from "lucide-react";
import Link from "next/link";

export default function ComingSoon() {
    const features = [
        { icon: <LineChartIcon strokeWidth={1.5} size={14} />, text: "Advanced Analytics Dashboard - track important metrics" },
        { icon: <PaletteIcon strokeWidth={1.5} size={14} />, text: "50 + Domain specific themes - data, cyber, AI/ML, Cloud, etc." },
        { icon: <LinkIcon strokeWidth={1.5} size={14} />, text: "Integrations - import projects and stats from GitHub, hack the box etc." },
        { icon: <LightbulbIcon strokeWidth={1.5} size={14} />, text: "Resources for building high quality portfolios" },
        { icon: <GlobeIcon strokeWidth={1.5} size={14} />, text: "Custom domain support" },
        { icon: <SearchIcon strokeWidth={1.5} size={14} />, text: "SEO optimization" },
        { icon: <MoonIcon strokeWidth={1.5} size={14} />, text: "Dark mode" }
    ];

    return (
        <div className="w-full h-full items-center relative gap-10 flex flex-col lg:flex-row lg:justify-center pt-20 lg:pt-0">
            <div className="">
                <span className="text-sm font-light">Dashboard & Analytics</span>
                <h2 className="text-4xl font-normal">New features on the way </h2>
                <div className="flex items-center max-w-md space-x-2 mt-2">
                    We have signed you up for our newsletter. You will receive product insights, tips & tricks, and changelog updates.
                </div>

                {/* buttons to add projest and design portfolio */}
                <div className="flex gap-2 mt-4">
                    <Link href={'/dashboard/build'} className="px-4 py-2 bg-gray-900 text-white border shadow-sm text-sm rounded-md hover:bg-gray-800">Add projects</Link>
                    <Link href={'/dashboard/design'} className="px-4 py-2 bg-white text-black border text-sm shadow-sm rounded-md hover:bg-white/60">Design portfolio</Link>
                </div>
            </div>
            <div className="">
                <ul className="space-y-2 text-left">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            {feature.icon}
                            {feature.text}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col items-center text-center text-gray-600 text-xs justify-center space-x-1 absolute bottom-20 lg:bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-1"><a href="" className="underline text-blue-500">Opt out </a> <span>of the mailing list</span> </div>
                <div className="mt-2">
                    Follow us on <a href="https://twitter.com/creativetim" className="text-blue-500">Linkedin</a> and <a href="https://www.instagram.com/creativetimofficial/" className="text-blue-500">X.com</a> for the insights!
                </div>
            </div>
        </div>
    );
}