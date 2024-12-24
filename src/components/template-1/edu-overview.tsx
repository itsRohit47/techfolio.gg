/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { GraduationCapIcon, ChevronRight, DownloadIcon, TrashIcon, PlusIcon } from "lucide-react";
import EditCardButton from "../edit-card-button";
import { useState } from "react";

const EducationOverview = () => {
    const session = useSession();
    const { data: edus } = api.user.getUserEducations.useQuery({ uid: session.data?.user?.id ?? "" });
    const [isEditing, setIsEditing] = useState(false);
    const { mutate: addEdu } = api.user.addUserEducation.useMutation();
    const { mutate: deleteEdu } = api.user.deleteUserEducation.useMutation();
    const { mutate: updateEdu } = api.user.updateUserEducation.useMutation();
    const [expanded, setExpanded] = useState<string | null>(null);
    const formData = {
        university: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
    }

    const handleToggle = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    const onEdit = () => {
        setIsEditing(true);
    }

    return (
        <section>
            {edus?.length ? <div className="p-4 rounded-lg lightBg dark:bg-secondary text-xs flex flex-col gap-5">
                <div className="flex gap-2 mb-2 opacity-70">
                    <GraduationCapIcon size={16}  opacity={.7}/>
                    <div>Education</div>
                    <EditCardButton className="ml-auto" onEdit={() => { onEdit() }} onSave={() => { console.log('') }} />
                </div>
                <div className="flex flex-col gap-3 max-h-10 overflow-y-auto">
                    {edus.map((edu) => (
                        <div key={edu.id} className={`flex flex-col group gap-3 items-start justify-between  ${edus.indexOf(edu) !== edus.length - 1 ? 'border-b border-b-white/10 pb-3' : ''}`}>
                            <div className="flex gap-2 items-start justify-between w-full cursor-pointer" onClick={() => handleToggle(edu.id)}>
                                <div className="flex gap-2 items-center">
                                    {edu.uniLogo ? <img src={edu.uniLogo} alt={edu.universityName ?? 'University Logo'} className="w-10 h-10 rounded-full p-px border  bg-white object-cover" /> : <div className="w-8 h-8 rounded-full bg-gray-300"></div>}
                                    <div className="flex flex-col gap-1">
                                        <div className="font-semibold flex items-center gap-2 dark:text-white text-black">
                                            <div>{edu.universityName}</div>
                                            <ChevronRight size={14} strokeWidth={1} className={`group-hover:translate-x-1 transition-transform ${expanded === edu.id ? 'rotate-90' : ''}`} />
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-60">{edu.courseName}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{edu.startYear} - {edu.endYear === null ? 'Present' : edu.endYear}</div>
                            </div>
                            {expanded === edu.id && <div className="text-xs text-gray-400 my-2">{edu.fieldOfStudy}</div>}
                        </div>
                    ))}
                </div>
                <button className="btn">
                    <DownloadIcon size={14} className="" />
                    Download Transcript
                </button>
            </div> : <div className="">No education found</div>}
        </section>
    );
}

export default EducationOverview;