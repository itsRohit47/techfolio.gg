'use client';
import { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';


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

    useEffect(() => {
        setIcon(data?.icon ?? null);
        setTitle(data?.title ?? '');
        setDescription(data?.description ?? '');
        setBody(data?.body ?? '');
        setLink(data?.links ?? '');
    }, [data]);


    return (
        <div className="">
            <h2 className="text-sm font-bold">Edit Project</h2>
            <div className="mt-4">
                <input type="text" placeholder="Project icon URL" className="w-full p-2 border border-gray-200 rounded-md" defaultValue={icon ?? ''} onChange={(e) => setIcon(e.target.value)} />
                <input type="text" placeholder="Title" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Project Description" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="text" placeholder="Project URL" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={link} onChange={(e) => setLink(e.target.value)} />
                <textarea rows={6} placeholder="Project Body" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue={body} onChange={(e) => setBody(e.target.value)} />
                <div className="flex justify-end mt-4">
                    <button className="bg-violet-500 text-white p-2 rounded-md flex items-center" onClick={() => {
                        setIsLoading(true);
                        editProject({
                            projectId: project_id, icon, title, description, body, link,
                            skills: []
                        }, {
                            onSuccess: () => {
                                ctx.user.getUserProjects.invalidate();
                                setIsLoading(false);
                                onClose();
                            },
                            onError: () => {
                                setIsLoading(false);
                            }
                        });
                    }} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
