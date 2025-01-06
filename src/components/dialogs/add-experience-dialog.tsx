/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useState } from "react";
import { Loader2, PencilIcon } from "lucide-react";


export default function AddExperienceDialog({ onClose }: { onClose: () => void }) {
    const { mutate: addExperience } = api.user.addExperience.useMutation(
        {
            onSuccess: () => {
                setIsLoading(false);
                void ctx.user.getUserExperiences.invalidate();
                onClose();
            },
        }
    );
    const [logo, setLogo] = useState<string | null>(null);
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    // Add missing state variables


    const ctx = api.useUtils();
    return (
        <div className="">
            <h2 className="text-sm font-bold">Add Experience</h2>
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
                    placeholder="Company Name"
                    className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setCompany(e.target.value)}
                />
                {company === "" && <span className="text-red-500 text-xs">* Company Name is required</span>}
                <input
                    type="text"
                    placeholder="Title / Position"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setPosition(e.target.value)}
                />
                {position === "" && <span className="text-red-500 text-xs">* Title / Position is required</span>}
                <input
                    type="text"
                    placeholder="Location"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setLocation(e.target.value)}
                />
                {location === "" && <span className="text-red-500 text-xs">* Location is required</span>}
                <input type="text"
                    placeholder="Company URL"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setUrl(e.target.value)}
                />
                {url === "" && <span className="text-red-500 text-xs">* Company URL is required</span>}
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
                <textarea
                    placeholder="Description"
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setDescription(e.target.value)}
                />
                {description === "" && <span className="text-red-500 text-xs">* Description is required</span>}
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-violet-500 text-white p-2 rounded-md flex items-center disabled:opacity-50"
                        onClick={() => {
                            setIsLoading(true);
                            addExperience({
                                company,
                                description,
                                location,
                                title: position,
                                startDate: parseInt(startYear),
                                endDate: parseInt(endYear) || -1,
                                logo: logo || '/avatar.png',
                            }, {
                                onSuccess: () => {
                                    setIsLoading(false);
                                    void ctx.user.getUserExperiences.invalidate();
                                    onClose();
                                },
                                onError: () => {
                                    setIsLoading(false);
                                }
                            });
                        }}
                        disabled={isLoading || company === "" || position === "" || location === "" || description === "" || startYear === "" || url === ""}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Education
                    </button>
                </div>
            </div>
        </div>
    );
}