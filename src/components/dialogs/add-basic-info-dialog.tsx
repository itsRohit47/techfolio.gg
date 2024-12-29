'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
export default function AddBasicInfoDialog({ onClose }: { onClose: () => void }) {
    const session = useSession();
    const { data } = api.user.getUserBasicData.useQuery(
        { username: session.data?.user?.username }
    );
    const ctx = api.useUtils();

    const [isLoading, setIsLoading] = useState(false);

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

    const [name, setName] = useState(data?.name || 'John Doe');
    const [headline, setHeadline] = useState(data?.headline || 'Software Engineer with 5 years of experience');
    const [location, setLocation] = useState(data?.location || 'New York');
    const [bio, setBio] = useState(data?.bio || 'I love coding');

    return (
        <div className="">
            <h2 className="text-sm font-bold">Edit Basic Info</h2>
            <div className="mt-4">
                <input type="text" placeholder={name} className="w-full p-2 border border-gray-200 rounded-md" onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder={headline} className="mt-2 w-full p-2 border border-gray-200 rounded-md" onChange={(e) => setHeadline(e.target.value)} />
                <input type="text" placeholder={location} className="mt-2 w-full p-2 border border-gray-200 rounded-md" onChange={(e) => setLocation(e.target.value)} />
                <textarea rows={4} placeholder={bio} className="mt-2 w-full p-2 border border-gray-200 rounded-md" onChange={(e) => setBio(e.target.value)} />
                <div className="flex justify-end mt-4">
                    <button className="bg-violet-500 text-white p-2 rounded-md flex items-center disabled:opacity-50"
                        disabled={isLoading}
                        onClick={() => {
                            updateBasicInfo({
                                name,
                                headline,
                                location,
                                bio,
                                image: ""
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