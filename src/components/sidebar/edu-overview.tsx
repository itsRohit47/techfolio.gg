/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { GraduationCapIcon, TrashIcon } from "lucide-react";
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

    return (
        <div className={`flex group gap-2 items-start pb-2 ${!isLast ? 'border-b border-gray-200' : ''}`}>
            <div className="flex gap-2 items-center w-full">
                {edu.uniLogo ? <img src={edu.uniLogo} alt={edu.universityName ?? 'University logo'} className="w-6 h-6 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-gray-300"></div>}
                <div className="">{edu.courseName}</div>
            </div>
            <div className="hover:bg-sky-100 p-1 rounded-md cursor-pointer border border-sky-200 bg-sky-50 text-xs text-sky-600">
                Edit
            </div>
            <div className="hover:bg-red-100 p-1 rounded-md cursor-pointer border border-red-200 bg-red-50 text-xs text-red-600">
                Delete
            </div>
        </div>
    );
}

const EducationOverview = () => {
    const session = useSession();
    const { data: edus } = api.user.getUserEducations.useQuery({ uid: session.data?.user?.id ?? "" });
    return (
        <div className="flex flex-col gap-2 w-full">
            {
                edus?.length ? (
                    <div className="flex flex-col gap-2 overflow-y-auto">
                        {edus.map((edu, index) => (
                            <EducationItem key={edu.id} edu={edu} isLast={index === edus.length - 1} />
                        ))}
                    </div>
                ) : (
                    <div className="border w-full p-10 rounded-lg text-center flex items-center justify-center flex-col gap-3">
                        <p className="text-gray-500">Add your education to showcase your qualifications</p>
                    </div>
                )
            }
        </div>);
}

export default EducationOverview;