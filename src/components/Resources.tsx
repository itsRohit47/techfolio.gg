'use client';
import { ArrowUpRight } from "lucide-react";

export default function Resources() {
    return (
        <div className="">
            <div className="grid lg:grid-cols-2 gap-4">
                <CardWithLink title="How to build a high quality cyber portfolio?" description="Read more about how to build a high quality cyber portfolio" link="https://cyberportfol.io" />
                <CardWithLink title="No Experience? No worries" description="How to gain experience in cyber security?" link="https://tailwindcss.com" />
                <CardWithLink title="Cyber Security Certifications" description="List of cyber security certifications" link="https://tailwindcss.com" />
                <CardWithLink title="Cyber Security Internships" description="List of cyber security internships" link="https://tailwindcss.com" />
            </div>
        </div>
    );
}


function CardWithLink({ title, description, link }: { title: string, description: string, link: string }) {
    return (
        <div onClick={() => {
            window.open(link, "_blank");
        }} className="bg-gray-400/15 flex items-center justify-between group hover:bg-gray-400/20 p-3  rounded-sm hover:shadow-lg cursor-pointer border hover:border-green-500/30  transition duration-300 ease-in-out">
            <div className="flex flex-col gap-2">
                <h1 className="text-sm">{title}</h1>
                <p className="text-xs text-tertiary">{description}</p>
            </div>
            <div className="flex items-center h-4 group-hover:translate-x-1 transition-transform duration-300">
                <ArrowUpRight className="text-secondary  h-full w-full" />
            </div>
        </div>
    );
}   