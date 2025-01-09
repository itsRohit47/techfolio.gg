/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import EditProjectDialog from "../dialogs/edit-project-dialog";
import EditExperienceDialog from "../dialogs/edit-experience-dialog";

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
    const [isExperienceDialogOpen, setExperienceDialogOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
    const ctx = api.useUtils();
    const [isDeleting, setIsDeleting] = useState({
        status: false,
        ExpId: ""
    });
    const { mutate: deleteUserExperience } = api.user.deleteUserExperience.useMutation(
        {
            onMutate: async (deleteData) => {
                setIsDeleting({ status: true, ExpId: deleteData.expId });
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
            <div className="flex gap-2 items-center w-full">
                {exp.companyLogo ? <img src={exp.companyLogo} alt={exp.company ?? 'Company logo'} className="w-6 h-6 border rounded-full bg-white object-cover" /> : <div className="w-6 h-6 rounded-full bg-gray-300"></div>}
                <div className="">{exp.title}</div>
            </div>
            <Dialog onOpenChange={setExperienceDialogOpen} open={isExperienceDialogOpen}>
                <DialogTrigger>
                    <div className="hover:bg-sky-100 p-1 rounded-md cursor-pointer border border-sky-200 bg-sky-50 text-xs text-sky-600" onClick={() => setSelectedExperience(exp.id)}>
                        Edit
                    </div>
                </DialogTrigger>
                <DialogContent className="p-4">
                    <DialogTitle className="hidden">Edit Project</DialogTitle>
                    <EditExperienceDialog exp_id={selectedExperience ?? ''} onClose={
                        () => setExperienceDialogOpen(false)
                    } />
                </DialogContent>
            </Dialog>
            <div className="hover:bg-red-100 p-1 rounded-md cursor-pointer border border-red-200 bg-red-50 text-xs text-red-600 flex gap-1 items-center" onClick={() => deleteUserExperience({ expId: exp.id })}>
                {isDeleting.status && isDeleting.ExpId === exp.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Delete
            </div>
        </div >
    );
}

const ExperienceOverview = () => {
    const session = useSession();
    const { data: experiences, isLoading } = api.user.getUserExperiences.useQuery({ uid: session.data?.user?.id ?? "" }, {
        enabled: !!session.data?.user?.id
    });

    const sortedExperiences = useMemo(() => {
        return experiences?.slice().sort((a, b) => {
            const endYearA = a.endYear === null ? new Date().getFullYear() : a.endYear;
            const endYearB = b.endYear === null ? new Date().getFullYear() : b.endYear;
            return endYearB - endYearA || b.startYear - a.startYear;
        });
    }, [experiences]);


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


