/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import EditEducationDialog from "../dialogs/edit-education-dialog";
import { useState } from "react";
import { } from "@radix-ui/react-dialog";
import { DialogTitle, Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

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
    const [selectedEducation, setSelectedEducation] = useState<string | null>(null);
    const ctx = api.useUtils();
    const [isDeleting, setIsDeleting] = useState({
        status: false,
        EduId: ""
    });
    const { mutate: deleteUserEducation } = api.user.deleteUserEducation.useMutation(
        {
            onMutate: async (deleteData) => {
                setIsDeleting({ status: true, EduId: deleteData.eduId });
            },

            onSettled: () => {
                void ctx.user.getUserEducations.invalidate();
            }
        }

    );

    return (
        <div className={`flex group gap-2 items-start pb-2 ${!isLast ? 'border-b border-gray-200' : ''}`}>
            <div className="flex gap-2 items-center w-full">
                {edu.uniLogo ? <img src={edu.uniLogo} alt={edu.universityName ?? 'University logo'} className="w-6 h-6 rounded-full object-cover" /> : <div className="w-6 h-6 rounded-full bg-gray-300"></div>}
                <div className="">{edu.courseName}</div>
            </div>
            <Dialog onOpenChange={setIsEditing} open={isEditing}>
                <DialogTrigger>
                    <div className="hover:bg-sky-100 p-1 rounded-md cursor-pointer border border-sky-200 bg-sky-50 text-xs text-sky-600" onClick={() => setSelectedEducation(edu.id)}>
                        Edit
                    </div>
                </DialogTrigger>
                <DialogContent className="p-4">
                    <DialogTitle className="hidden">Edit Project</DialogTitle>
                    <EditEducationDialog edu_id={selectedEducation!}
                        onClose={
                            () => setIsEditing(false)
                        } />
                </DialogContent>
            </Dialog>
            <div className="hover:bg-red-100 p-1 rounded-md cursor-pointer border border-red-200 bg-red-50 text-xs text-red-600 flex gap-1 items-center" onClick={() => deleteUserEducation({ eduId: edu.id })}>
                {isDeleting.status && isDeleting.EduId === edu.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Delete
            </div>
        </div>
    );
}

const EducationOverview = () => {
    const session = useSession();
    const { data: edus, isLoading } = api.user.getUserEducations.useQuery({ uid: session.data?.user?.id ?? "" });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2 group w-full pb-2 border-b border-gray-100 flex-col">
                    <div className="flex items-center gap-2 w-full">
                        <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                        <div className="w-1/2 h-4 bg-gray-100 rounded-md"></div>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                        <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                        <div className="w-1/2 h-4 bg-gray-100 rounded-md"></div>
                    </div>
                </div>
            </div>
        );
    }
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