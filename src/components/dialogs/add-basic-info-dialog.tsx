/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { PencilIcon } from "lucide-react";
export default function AddBasicInfoDialog({ onClose }: { onClose: () => void }) {
    const session = useSession();
    const { data } = api.user.getUserBasicData.useQuery(
        { username: session.data?.user?.username }
    );
    const ctx = api.useUtils();

    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const { mutate: updateBasicInfo } = api.user.updateUserBasicData.useMutation(
        {
            onMutate: async (newData) => {
                setIsLoading(true);
            },
            onSuccess: () => {
                setIsLoading(false);
                void ctx.user.getUserBasicData.invalidate();
                onClose();
            }
        }
    );

    const [image, setImage] = useState(data?.image || '');
    const [name, setName] = useState(data?.name || 'John Doe');
    const [headline, setHeadline] = useState(data?.headline || 'Software Engineer with 5 years of experience');
    const [location, setLocation] = useState(data?.location || 'New York');
    const [bio, setBio] = useState(data?.bio || 'I love coding');

    return (
        <div className="">
            <h2 className="text-sm font-bold">Edit Basic Info</h2>
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
                                setImage(reader.result as string);
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
                            setImage(data.url);
                        }
                    }
                }}>
                    {image ?
                        <img src={image} alt="profile" className="w-16 h-16 rounded-full object-cover opacity-70 bg-black" />
                        : <img src="/avatar.png" alt="profile" className="w-16 h-16 rounded-full object-cover opacity-70 bg-black" />
                    }
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-0 bg-white rounded-full p-[6px] w-max h-max cursor-pointer">
                        <PencilIcon size={12} />
                    </div>
                </div>
                <input type="text" placeholder={name} defaultValue={name} className="w-full p-2 border border-gray-200 rounded-md mt-3" onChange={(e) => setName(e.target.value)} />
                {name === "" && <span className="text-red-500 text-xs">* Title is required</span>}
                <input type="text" placeholder={headline} defaultValue={headline} className="mt-2 w-full p-2 border border-gray-200 rounded-md" onChange={(e) => setHeadline(e.target.value)} />
                <input type="text" placeholder={location} defaultValue={location} className="mt-2 w-full p-2 border border-gray-200 rounded-md" onChange={(e) => setLocation(e.target.value)} />
                <textarea rows={4} placeholder={bio} defaultValue={bio} className="mt-2 w-full p-2 border border-gray-200 rounded-md" onChange={(e) => setBio(e.target.value)} />
                <div className="flex justify-end mt-4">
                    <button className="bg-violet-500 text-white p-2 rounded-md flex items-center disabled:opacity-50"
                        disabled={isLoading || name === ''}
                        onClick={async () => {
                            updateBasicInfo({
                                name,
                                headline,
                                location,
                                bio,
                                image: image || '/avatar.png',
                            });
                        }}>
                        {isLoading && <span className="mr-2 animate-spin"><Loader2 size={16} /></span>}
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}