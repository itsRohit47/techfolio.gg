/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Loader2, PencilIcon, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton'; // Added Skeleton import


interface EditEducationDialogProps {
    edu_id: string;
    onClose: () => void;
}

export default function EditEducationDialog({ edu_id, onClose, }: EditEducationDialogProps) {
    const { mutate: editEducation } = api.user.updateEducation.useMutation();
    const { data, isLoading: isLoadingProject } = api.user.getEducationById.useQuery({ educationId: edu_id });
    const ctx = api.useUtils();
    const [logo, setLogo] = useState<string | null>(data?.uniLogo ?? null);
    const [university, setUniversity] = useState(data?.universityName ?? '');
    const [course, setCourse] = useState(data?.courseName ?? '');
    const [fieldOfStudy, setFieldOfStudy] = useState(data?.fieldOfStudy ?? '');
    const [startYear, setStartYear] = useState(data?.startYear ?? 2000);
    const [endYear, setEndYear] = useState(data?.endYear ?? 2001);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        setLogo(data?.uniLogo ?? null);
        setUniversity(data?.universityName ?? '');
        setCourse(data?.courseName ?? '');
        setFieldOfStudy(data?.fieldOfStudy ?? '');
        setStartYear(data?.startYear ?? 2000);
        setEndYear(data?.endYear ?? 2001);
    }, [data]);

    if (isLoadingProject) {
        return (
            <div className="flex flex-col space-y-4 p-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
            </div>
        );
    }

    return (
        <div className="">
            <h2 className="text-sm font-bold">Edit Education</h2>
            <div className="mt-4">
                <div className="relative w-max" onClick={async () => {
                    const reader = new FileReader();
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg, image/png, image/jpg, image/gif';
                    input.onchange = () => {
                        const file = input.files?.[0];
                        if (file) {
                            setImageFile(file);
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                                setLogo(reader.result as string);
                            };
                        }
                    };
                    input.click();
                    if (imageFile) {
                        const formData = new FormData();
                        formData.append('file', imageFile);
                        const res = await fetch('/api/image/upload', {
                            method: 'POST',
                            body: formData,
                        });
                        const data = await res.json();
                        if (data.url) {
                            setLogo(data.url);
                        }
                    }
                }}>
                    {logo ?
                        <img src={logo} alt="profile" className="w-16 h-16 rounded-full object-cover opacity-70 bg-black" />
                        : <img src="/avatar.png" alt="profile" className="w-16 h-16 rounded-full object-cover opacity-70 bg-black" />
                    }
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-0 bg-white rounded-full p-[6px] w-max h-max cursor-pointer">
                        <PencilIcon size={12} />
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="University Name"
                    className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue={university}
                    onChange={(e) => setUniversity(e.target.value)}
                />
                {university === "" && <span className="text-red-500 text-xs">* University name is required</span>}
                <input
                    type="text"
                    placeholder="Course Name"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue={course}
                    onChange={(e) => setCourse(e.target.value)}
                />
                {course === "" && <span className="text-red-500 text-xs">* Course name is required</span>}
                <input
                    type="text"
                    placeholder="Field of Study"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                />
                {fieldOfStudy === "" && <span className="text-red-500 text-xs">* Field of study is required</span>}
                <input
                    type="number"
                    placeholder="Start Year"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue={startYear}
                    onChange={(e) => setStartYear(Number(e.target.value))}
                />
                {startYear === 0 && <span className="text-red-500 text-xs">* Start year is required</span>}
                <input
                    type="number"
                    placeholder="End Year"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue={endYear}
                    onChange={(e) => setEndYear(Number(e.target.value))}
                />
                {endYear === 0 && <span className="text-red-500 text-xs">* End year is required</span>}
                <div className="flex justify-end mt-4">
                    <button className="bg-violet-500 text-white p-2 rounded-md flex items-center disabled:opacity-50" onClick={() => {
                        setIsLoading(true);
                        editEducation({
                            educationId: edu_id,
                            university,
                            degree: course,
                            field: fieldOfStudy,
                            startYear,
                            endYear,
                            uniLogo: logo,
                        }, {
                            onSuccess: () => {
                                void ctx.user.getUserEducations.invalidate();
                                void ctx.user.getEducationById.invalidate({ educationId: edu_id });
                                setIsLoading(false);
                                onClose();
                            },
                            onError: () => {
                                setIsLoading(false);
                            }
                        });
                    }} disabled={isLoading || university === '' || course === '' || fieldOfStudy === '' || startYear === 0 || endYear === 0}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
