/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Loader2, PencilIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

export default function AddEducationDialog({ onClose }: { onClose: () => void }) {
    const { mutate: addEducation } = api.user.addEducation.useMutation(
        {
            onSuccess: () => {
                setIsLoading(false);
                void ctx.user.getUserEducations.invalidate();
                onClose();
            },
        }
    );
    const [logo, setLogo] = useState<string | null>(null);
    const [university, setUniversity] = useState("");
    const [course, setCourse] = useState("");
    const [fieldOfStudy, setFieldOfStudy] = useState("");
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const ctx = api.useUtils();
    return (
        <div className="">
            <h2 className="text-sm font-bold">Add Education</h2>
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
                    onChange={(e) => setUniversity(e.target.value)}
                />
                {university === "" && <span className="text-red-500 text-xs">* University Name is required</span>}
                <input
                    type="text"
                    placeholder="Course"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setCourse(e.target.value)}
                />
                {course === "" && <span className="text-red-500 text-xs">* Course is required</span>}
                <input
                    type="text"
                    placeholder="Field of Study"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                />
                {fieldOfStudy === "" && <span className="text-red-500 text-xs">* Field of Study is required</span>}
                <input
                    type="number"
                    placeholder="Start Year"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setStartYear(e.target.value)}
                />
                {startYear === "" && <span className="text-red-500 text-xs">* Start Year is required</span>}
                <input
                    type="number"
                    placeholder="End Year"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setEndYear(e.target.value)}
                />
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-violet-500 text-white p-2 rounded-md flex items-center disabled:opacity-50"
                        onClick={() => {
                            setIsLoading(true);
                            addEducation({
                                university,
                                degree: course,
                                field: fieldOfStudy,
                                startYear: parseInt(startYear),
                                endYear: parseInt(endYear) || -1,
                                uniLogo: logo || '/avatar.png'
                            }, {
                                onSuccess: () => {
                                    setIsLoading(false);
                                    void ctx.user.getUserEducations.invalidate();
                                    onClose();
                                },
                                onError: () => {
                                    setIsLoading(false);
                                }
                            });
                        }}
                        disabled={isLoading || university === "" || course === "" || fieldOfStudy === "" || startYear === "" }
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Education
                    </button>
                </div>
            </div>
        </div>
    );
}