/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Loader2, PencilIcon, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton'; // Added Skeleton import


interface EditExperienceDialogProps {
    exp_id: string;
    onClose: () => void;
}

export default function EditExperienceDialog({ exp_id, onClose, }: EditExperienceDialogProps) {
    const { mutate: editExperience } = api.user.updateExperience.useMutation();
    const { data, isLoading: isLoadingProject } = api.user.getExperienceById.useQuery({ experienceId: exp_id });
    const ctx = api.useUtils();
    const [logo, setLogo] = useState<string | null>(data?.companyLogo ?? null);
    const [title, setTitle] = useState(data?.title ?? '');
    const [description, setDescription] = useState(data?.description ?? '');
    const [company, setCompany] = useState(data?.company ?? '');
    const [url, setUrl] = useState(data?.companyUrl ?? '');
    const [location, setLocation] = useState(data?.location ?? '');
    const [startYear, setStartYear] = useState(data?.startYear ?? '');
    const [endYear, setEndYear] = useState(data?.endYear ?? '');
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        setTitle(data?.title ?? '');
        setDescription(data?.description ?? '');
        setCompany(data?.company ?? '');
        setUrl(data?.companyUrl ?? '');
        setLocation(data?.location ?? '');
        setStartYear(data?.startYear ?? '');
        setEndYear(data?.endYear ?? '');
        setLogo(data?.companyLogo ?? null);
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
            <h2 className="text-sm font-bold">Edit Project</h2>
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
                <input type="text" placeholder="Title" className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
                {title === "" && <span className="text-red-500 text-xs">* Title is required</span>}

                <div className="flex justify-end mt-4">
                    <button className="bg-violet-500 text-white p-2 rounded-md flex items-center disabled:opacity-50" onClick={() => {
                        setIsLoading(true);
                        editExperience({
                            experienceId: exp_id,
                            title,
                            description,
                            company,
                            companuUrl: url,
                            location,
                            startDate: Number(startYear),
                            endDate: endYear ? Number(endYear) : null,
                            logo: logo || '/avatar.png',
                        }, {
                            onSuccess: () => {
                                void ctx.user.getUserExperiences.invalidate();
                                void ctx.user.getExperienceById.invalidate({ experienceId: exp_id });
                                setIsLoading(false);
                                onClose();
                            },
                            onError: () => {
                                setIsLoading(false);
                            }
                        });
                    }} disabled={isLoading || title === ''}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
