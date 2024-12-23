/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { BriefcaseBusinessIcon, ChevronRight, DownloadIcon } from "lucide-react";
import EditCardButton from "../edit-card-button";
import { useState, useMemo } from "react";
import BlurFade from "../ui/blur-fade";

const ExperienceOverview = () => {
    const session = useSession();
    const { data: experiences } = api.user.getUserExperiences.useQuery({ uid: session.data?.user?.id ?? "" });
    const [expanded, setExpanded] = useState<string | null>(null);

    const sortedExperiences = useMemo(() => {
        return experiences?.slice().sort((a, b) => {
            const endYearA = a.endYear === null ? new Date().getFullYear() : a.endYear;
            const endYearB = b.endYear === null ? new Date().getFullYear() : b.endYear;
            return endYearB - endYearA || b.startYear - a.startYear;
        });
    }, [experiences]);

    const handleToggle = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };
    return (
        <section className=" ">
            {sortedExperiences?.length ? <div className="p-4 rounded-lg lightBg dark:bg-secondary text-xs flex flex-col gap-5 w-full">
                <div className="flex gap-2 mb-2 opacity-70">
                    <BriefcaseBusinessIcon size={16} opacity={.7}/>
                    <div>Work</div>
                    <EditCardButton className="ml-auto" onEdit={() => { console.log('') }} onSave={() => { console.log('') }} />
                </div>
                <div className="flex flex-col gap-3 overflow-y-auto">
                    {sortedExperiences.map((exp, index) => (
                        <div key={index} className={`flex  group flex-col gap-3 items-start justify-between  ${sortedExperiences.indexOf(exp) !== sortedExperiences.length - 1 ? 'border-b pb-3 border-b-white/10' : ''}`}>
                            <div className="flex gap-2 items-start justify-between w-full cursor-pointer" onClick={() => handleToggle(exp.id)}>
                                <div className="flex gap-2 items-center">
                                    {exp.companyLogo ? <img src={exp.companyLogo} alt={exp.company} className="w-10 h-10 p-px border rounded-full bg-white object-cover" /> : <div className="w-8 h-8 rounded-full bg-gray-300"></div>}
                                    <div className="flex flex-col gap-1">
                                        <div className="font-semibold flex items-center gap-2">
                                            <div>{exp.company}</div>
                                            <ChevronRight size={14} strokeWidth={1} className={`transition-transform group-hover:translate-x-1 ${expanded === exp.id ? 'rotate-90' : ''}`} />
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{exp.title}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{exp.startYear} - {exp.endYear === null ? 'Present' : exp.endYear}</div>
                            </div>
                            {expanded === exp.id && <div className="text-xs text-gray-500 dark:text-gray-400 my-2">{exp.description}</div>}
                        </div>
                    ))}
                </div>
                <button className="btn">
                    <DownloadIcon size={14} className="" />
                    Download CV
                </button>
            </div> : <div className="">No experience found</div>}
        </section>
    );
}
export default ExperienceOverview;


