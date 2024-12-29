'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AddProjectDialog({ onClose }: { onClose: () => void }) {
    const session = useSession();
    const { mutate: addProject } = api.user.addProject.useMutation();
    const [icon, setIcon] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [body, setBody] = useState("");
    const [link, setLink] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const ctx = api.useUtils();
    return (
        <div className="">
            <h2 className="text-sm font-bold">Add Project</h2>
            <div className="mt-4">
                <input type="text" placeholder="Title" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Project Description" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setDescription(e.target.value)} />
                <input type="text" placeholder="Project URL" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setLink(e.target.value)} />
                <input type="text" placeholder="Project icon URL" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setIcon(e.target.value)} />
                <textarea rows={6} placeholder="Project Body" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={(e) => setBody(e.target.value)} />
                <div className="flex justify-end mt-4">
                    <button className="bg-violet-500 text-white p-2 rounded-md flex items-center" onClick={() => {
                        setIsLoading(true);
                        addProject({
                            icon,
                            title,
                            description,
                            body,
                            link,
                            skills: []
                        }, {
                            onSuccess: () => {
                                setIsLoading(false);
                                void ctx.user.getUserProjects.invalidate();
                                onClose();
                            },
                            onError: () => {
                                setIsLoading(false);
                            }
                        });
                    }} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Project
                    </button>
                </div>
            </div>
        </div>
    );
}