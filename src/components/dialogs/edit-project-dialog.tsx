/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Loader2, PencilIcon, X } from 'lucide-react';
import { Badge } from '../ui/badge';


interface EditProjectDialogProps {
    project_id: string;
    onClose: () => void;
}

export default function EditProjectDialog({ project_id, onClose, }: EditProjectDialogProps) {
    const { mutate: editProject } = api.user.updateProject.useMutation();
    const { data } = api.user.getProjectById.useQuery({ projectId: project_id });
    const ctx = api.useUtils();
    const [icon, setIcon] = useState<string | null>(data?.icon ?? null);
    const [title, setTitle] = useState(data?.title ?? '');
    const [description, setDescription] = useState(data?.description ?? '');
    const [body, setBody] = useState(data?.body ?? '');
    const [link, setLink] = useState(data?.links ?? '');
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [skills, setSkills] = useState<string[]>(data?.skills?.map(skill => skill.name) ?? []);
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { data: skillSuggestions, isLoading: isLoadingSkills } = api.user.getSkillsBySearch.useQuery({
        search: search,
    });

    const handleAddSkill = (skill: string) => {
        if (!skills.includes(skill)) {
            setSkills([...skills, skill]);
        }
        setSearch("");
        setShowSuggestions(false);
    };

    const handleDeleteSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    useEffect(() => {
        setIcon(data?.icon ?? null);
        setTitle(data?.title ?? '');
        setDescription(data?.description ?? '');
        setBody(data?.body ?? '');
        setLink(data?.links ?? '');
        setSkills(data?.skills?.map(skill => skill.name) ?? []);
    }, [data]);


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
                                setIcon(reader.result as string);
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
                            setIcon(data.url);
                        }
                    }
                }}>
                    {icon ?
                        <img src={icon} alt="profile" className="w-16 h-16 rounded-full object-cover opacity-70 bg-black" />
                        : <img src="/avatar.png" alt="profile" className="w-16 h-16 rounded-full object-cover opacity-70 bg-black" />
                    }
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-0 bg-white rounded-full p-[6px] w-max h-max cursor-pointer">
                        <PencilIcon size={12} />
                    </div>
                </div>
                <input type="text" placeholder="Title" className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
                {title === "" && <span className="text-red-500 text-xs">* Title is required</span>}
                <input type="text" placeholder="Project Description" className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="text" placeholder="Project URL" className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={link} onChange={(e) => setLink(e.target.value)} />
                <div className='relative'>
                    <input type="text" placeholder="Add Skill" className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={search} onChange={(e) => {
                        setShowSuggestions(true);
                        setSearch(e.target.value);
                    }} />
                    {showSuggestions && search && (
                        <div className="absolute top-12 z-10 w-full bg-white rounded-md shadow-md p-2 max-h-60 border overflow-auto">
                            {
                                !isLoadingSkills && skillSuggestions && !skillSuggestions.some(skill => skill.name === search) && (
                                    <button className="flex items-center justify-between bg-slate-100 hover:bg-gray-100 p-2 rounded-md w-full" onClick={() => handleAddSkill(search)}>
                                        <p>Add <span className="font-bold">{search}</span></p>
                                    </button>
                                )
                            }
                            {
                                skillSuggestions?.map((skill) => (
                                    <button key={skill.id} className="flex items-center mt-1 justify-between p-2 rounded-md w-full hover:bg-gray-100" onClick={() => handleAddSkill(skill.name)}>
                                        <p>{skill.name}</p>
                                    </button>
                                ))
                            }
                            {
                                isLoadingSkills && (
                                    <div className="flex items-center justify-between mt-2 hover:bg-gray-100 p-2 rounded-md">
                                        <p>Loading...</p>
                                    </div>
                                )
                            }
                            {
                                !isLoadingSkills && skillSuggestions?.length === 0 && (
                                    <div className="flex items-center justify-between mt-2 p-2 rounded-md w-full">
                                        <p>No skill found related to <span className="font-bold">{search}</span></p>
                                    </div>
                                )
                            }
                        </div>
                    )}
                    {skills.length > 0 &&
                        <div className="flex gap-2 flex-wrap mt-2">
                            {
                                skills.map((skill, index) => (
                                    <Badge key={index} className="flex items-center gap-2 bg-blue-200">
                                        {skill}
                                        <button onClick={() => handleDeleteSkill(skill)} className="text-red-500">
                                            <X size={12} />
                                        </button>
                                    </Badge>
                                ))
                            }
                        </div>
                    }
                </div>

                <textarea rows={6} placeholder="Project Body" className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={body} onChange={(e) => setBody(e.target.value)} />
                <div className="flex justify-end mt-4">
                    <button className="bg-violet-500 text-white p-2 rounded-md flex items-center disabled:opacity-50" onClick={() => {
                        setIsLoading(true);
                        editProject({
                            projectId: project_id,
                            icon,
                            title,
                            description,
                            body,
                            link,
                            skills: skills,
                        }, {
                            onSuccess: () => {
                                void ctx.user.getUserProjects.invalidate();
                                void ctx.user.getUserSkills.invalidate();
                                void ctx.user.getSkillsBySearch.invalidate({ search: '' });
                                void ctx.user.getProjectById.invalidate({ projectId: project_id });
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
