/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react"
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import EditProjectDialog from "../dialogs/edit-project-dialog";
import { Loader2, GripVertical } from "lucide-react";
import { useState } from "react";
export default function ProjectsOverview() {
    const session = useSession();
    const { data: projs, isLoading } = api.user.getUserProjects.useQuery({ username: session.data?.user?.username ?? "" }, {
        enabled: !!session.data?.user?.username
    });
    const [isProjectDialogOpen, setProjectDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState({
        status: false,
        projectId: ""
    });
    const ctx = api.useUtils();
    const { mutate: deleteProject } = api.user.deleteUserProject.useMutation(
        {
            onMutate: async (deleteData) => {
                setIsDeleting({ status: true, projectId: deleteData.projectId });
            },

            onSettled: () => {
                setIsDeleting({ status: false, projectId: "" });
                void ctx.user.getUserProjects.invalidate();
                void ctx.user.getUserPortfolio.invalidate();
            }
        }
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2 group w-full pb-2 border-b border-gray-100 flex-col">
                    <div className="flex items-center gap-2 w-full">
                        <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                        <div className="w-1/2 h-4 bg-gray-100 rounded-md"></div>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                        <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                        <div className="w-1/2 h-4 bg-gray-100 rounded-md"></div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <>
            {projs?.length ? (
                <div className="flex flex-col gap-2 w-full">
                    {projs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((proj, index) => (
                        <div key={index} className={`flex items-center gap-2 group  w-full pb-2 ${index === projs.length - 1 ? '' : 'border-b border-gray-200'}`}>
                            <div className="flex items-center gap-2 w-full">
                                {proj.icon ? <img src={proj.icon} alt="project" className="w-6 h-6 border rounded-full object-cover" /> : <div className="w-6 h-6 rounded-full bg-gray-200"></div>}
                                <p key={index} className="text-sm line-clamp-1 w-full">{proj.title}</p>
                                <div className="flex gap-1">
                                    {proj.skills.slice(0, 2).map((skill, index) => (
                                        <div key={index} className="text-xs bg-gray-100 text-nowrap border text-gray-600 px-1 rounded-md">{skill.name}</div>
                                    ))}
                                    {proj.skills.length > 2 && (
                                        <span className="text-xs bg-gray-100 text-nowrap border text-gray-600 px-1 rounded-md">...</span>
                                    )}
                                </div>

                            </div>
                            <Dialog onOpenChange={setProjectDialogOpen} open={isProjectDialogOpen}>
                                <DialogTrigger>
                                    <div className="hover:bg-sky-100 p-1 rounded-md cursor-pointer border border-sky-200 bg-sky-50 text-xs text-sky-600" onClick={() => setSelectedProject(proj.id)}>
                                        Edit
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="p-4">
                                    <DialogTitle className="hidden">Edit Project</DialogTitle>
                                    <EditProjectDialog project_id={selectedProject!} onClose={
                                        () => setProjectDialogOpen(false)
                                    } />
                                </DialogContent>
                            </Dialog>
                            <div className="hover:bg-red-100 flex gap-1 items-center p-1 rounded-md cursor-pointer border border-red-200 bg-red-50 text-xs text-red-600" onClick={() => deleteProject({ projectId: proj.id })}>
                                {isDeleting.status && isDeleting.projectId === proj.id ? <Loader2 className="h-3 w-3 animate-spin" /> : ''} Delete
                            </div>
                            <GripVertical className="cursor-grab" size={20} />

                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-sm text-center border w-full p-10 rounded-lg flex items-center justify-center flex-col gap-3">
                    <p className="text-gray-500">Add your projects to showcase your work</p>
                </div>
            )}
        </>
    );
}