/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { BriefcaseBusinessIcon, ChevronRight, DownloadIcon, TrashIcon } from "lucide-react";
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
        <div className={`flex group gap-2 items-start ${!isLast ? 'border-b border-b-white/10 pb-3' : ''}`}>
            <div className="flex gap-2 items-center">
                {exp.companyLogo ? <img src={exp.companyLogo} alt={exp.company ?? 'Company logo'} className="w-6 h-6 border rounded-full bg-white object-cover" /> : <div className="w-8 h-8 rounded-full bg-gray-300"></div>}
                <div className="">{exp.title}</div>
            </div>
            <div className="hover:bg-gray-100 p-1 rounded-md cursor-pointer border border-gray-200 bg-gray-100 text-xs text-gray-600">
                Edit
            </div>
        </div >
    );
}

const ExperienceOverview = () => {
    const session = useSession();
    const { data: experiences } = api.user.getUserExperiences.useQuery({ uid: session.data?.user?.id ?? "" });

    const sortedExperiences = useMemo(() => {
        return experiences?.slice().sort((a, b) => {
            const endYearA = a.endYear === null ? new Date().getFullYear() : a.endYear;
            const endYearB = b.endYear === null ? new Date().getFullYear() : b.endYear;
            return endYearB - endYearA || b.startYear - a.startYear;
        });
    }, [experiences]);

    return (
        <div className="flex flex-col gap-2 w-full">
            {sortedExperiences?.length ?
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col gap-3 overflow-y-auto">
                        {sortedExperiences.map((exp, index) => (
                            <ExperienceItem key={exp.id} exp={exp} isLast={index === sortedExperiences.length - 1} />
                        ))}
                    </div>
                </div> :
                <div className="text-sm text-center border w-full p-10 rounded-lg flex items-center justify-center flex-col gap-3">
                    <p className=" text-gray-500">Add your experience to showcase your skills</p>
                </div>}
        </div>
    );
}

export default ExperienceOverview;


