/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { GraduationCapIcon, DownloadIcon, TrashIcon, PlusIcon } from "lucide-react";
import EditCardButton from "../edit-card-button";
import { useState } from "react";

interface Education {
    id: string;
    universityName: string | null;
    courseName: string | null;
    startYear: number | null;
    endYear: number | null;
    userId: string;
    fieldOfStudy: string | null;
    createdAt: Date;
    updatedAt: Date;
    uniLogo: string | null;
}

function EducationItem({ edu, isLast }: { edu: Education, isLast: boolean }) {
    const [isEditing, setIsEditing] = useState(false);
    const ctx = api.useUtils();
    const { mutate: deleteUserEducation } = api.user.deleteUserEducation.useMutation(
        {
            onMutate: async (id) => {
                await ctx.user.getUserEducations.cancel();
                const previousData = ctx.user.getUserEducations.getData();
                if (previousData) {
                    ctx.user.getUserEducations.setData({ uid: edu.userId }, previousData.filter((edu: { id: string }) => edu.id !== id.eduId));
                }
                return { previousData };
            },
            onError: (err, id, context) => {
                alert(err);
                if (context?.previousData) {
                    ctx.user.getUserEducations.setData({ uid: edu.userId }, context.previousData);
                }
            },
            onSettled: () => {
                void ctx.user.getUserEducations.invalidate();
            }
        }

    );

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className={`flex flex-col group gap-3 items-start justify-between ${!isLast ? 'border-b border-b-white/10 pb-3' : ''}`}>
            <div className="flex gap-2 items-start justify-between w-full">
                {edu.uniLogo ? <img src={edu.uniLogo} alt={edu.universityName ?? 'University logo'} className="w-10 h-10 p-px border rounded-full bg-white object-cover" /> : <div className="w-8 h-8 rounded-full bg-gray-300"></div>}
                <div className="flex gap-2 justify-between w-full">
                    <div className="flex flex-col gap-1">
                        <div>{edu.universityName}</div>
                        <div className="text-gray-500 dark:text-gray-400">{edu.courseName}</div>
                    </div>
                </div>
                <div className="text-gray-500 text-nowrap dark:text-gray-400">{edu.startYear} - {edu.endYear === null ? 'Present' : edu.endYear}</div>
                <div className="flex  gap-x-2 items-center ">
                    {isEditing &&
                        <TrashIcon size={20} className="shadow-2xl text-xs flex items-center gap-x-1 cursor-pointer bg-red-500/30 border border-red-500/50 rounded-sm text-red-500 p-1" onClick={(e) => {
                            e.stopPropagation();
                            deleteUserEducation({ eduId: edu.id });
                        }} />}
                    <EditCardButton onEdit={handleEdit} onSave={handleEdit} />
                </div>
            </div>
        </div>
    );
}

const EducationOverview = () => {
    const session = useSession();
    const { data: edus } = api.user.getUserEducations.useQuery({ uid: session.data?.user?.id ?? "" });
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <section className="h-max">
            {edus?.length ? (
                <div className="p-4 pb-6 rounded-md lightBg dark:bg-secondary/40 flex flex-col gap-5 text-sm">
                    <div className="flex gap-2 opacity-70 text-sm">
                        <GraduationCapIcon size={16} opacity={.7} />
                        <div>Education</div>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto">
                        {edus.map((edu, index) => (
                            <EducationItem key={edu.id} edu={edu} isLast={index === edus.length - 1} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-xs border w-full p-10 rounded-lg flex items-center justify-center flex-col gap-3">
                    <GraduationCapIcon size={24} opacity={.7} />
                    <h1 className="text-xl font-bold">No Education found</h1>
                    <p className="text-base text-gray-500">Add your education to showcase your skills</p>
                    <button className="border hover:bg-gray-50 dark:bg-secondary px-2 py-1 rounded-md text-sm">Add Education</button>
                </div>
            )}
        </section>
    );
}

export default EducationOverview;