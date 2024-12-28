/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { BriefcaseBusinessIcon, ChevronRight, DownloadIcon, TrashIcon } from "lucide-react";
import EditCardButton from "../edit-card-button";
import { useState, useMemo } from "react";

interface Experience {
    id: string;
    company: string | null;
    title: string | null;
    startYear: number | null;
    endYear: number | null;
    userId: string;
    companyLogo: string | null;
}

function ExperienceItem({ exp, isLast }: { exp: Experience, isLast: boolean }) {
    const [isEditing, setIsEditing] = useState(false);
    const ctx = api.useUtils();
    const { mutate: deleteUserExperience } = api.user.deleteUserExperience.useMutation(
        {
            onMutate: async (id) => {
                await ctx.user.getUserExperiences.cancel();
                const previousData = ctx.user.getUserExperiences.getData();
                if (previousData) {
                    ctx.user.getUserExperiences.setData({ uid: exp.userId }, previousData.filter((exp: { id: string }) => exp.id !== id.expId));
                }
                return { previousData };
            },
            onError: (err, id, context) => {
                alert(err);
                if (context?.previousData) {
                    ctx.user.getUserExperiences.setData({ uid: exp.userId }, context.previousData);
                }
            },
            onSettled: () => {
                void ctx.user.getUserExperiences.invalidate();
            }
        }
    );

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className={`flex flex-col group gap-3 items-start justify-between ${!isLast ? 'border-b border-b-white/10 pb-3' : ''}`}>
            <div className="flex gap-2 items-start justify-between w-full">
                {exp.companyLogo ? <img src={exp.companyLogo} alt={exp.company ?? 'Company logo'} className="w-10 h-10 p-px border rounded-full bg-white object-cover" /> : <div className="w-8 h-8 rounded-full bg-gray-300"></div>}
                <div className="flex gap-2 justify-between w-full">
                    <div className="flex flex-col gap-1">
                        <div>{exp.company}</div>
                        <div className="text-gray-500 dark:text-gray-400">{exp.title}</div>
                    </div>
                </div>
                <div className="text-gray-500 text-nowrap dark:text-gray-400">{exp.startYear} - {exp.endYear === null ? 'Present' : exp.endYear}</div>
                <div className="flex gap-x-2 items-center">
                    {isEditing &&
                        <TrashIcon size={20} className="shadow-2xl text-xs flex items-center gap-x-1 cursor-pointer bg-red-500/30 border border-red-500/50 rounded-sm text-red-500 p-1" onClick={(e) => {
                            e.stopPropagation();
                            deleteUserExperience({ expId: exp.id });
                        }} />}
                    <EditCardButton onEdit={handleEdit} onSave={handleEdit} />
                </div>
            </div>
        </div>
    );
}

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
        <section className="h-max ">
            {sortedExperiences?.length ? <div className="p-4 pb-6 rounded-md lightBg dark:bg-secondary/40 text-sm flex flex-col gap-5 w-full">
                <div className="flex gap-2 opacity-70">
                    <BriefcaseBusinessIcon size={16} opacity={.7} />
                    <div>Work</div>
                    <EditCardButton className="hidden ml-auto" onEdit={() => { console.log('') }} onSave={() => { console.log('') }} />
                </div>
                <div className="flex flex-col gap-3 overflow-y-auto">
                    {sortedExperiences.map((exp, index) => (
                        <ExperienceItem key={exp.id} exp={exp} isLast={index === sortedExperiences.length - 1} />
                    ))}
                </div>
            </div> :
                <div className="text-xs border w-full p-10 rounded-lg flex items-center justify-center flex-col gap-3">
                    <BriefcaseBusinessIcon size={24} opacity={.7} />
                    <h1 className="text-xl font-bold">No Experience found</h1>
                    <p className="text-base text-gray-500">Add your experience to showcase your skills</p>
                    <button className="border hover:bg-gray-50 dark:bg-secondary px-2 py-1 rounded-md text-sm">Add Experience</button>
                </div>}
        </section>
    );
}

export default ExperienceOverview;


