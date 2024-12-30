/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react"
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import EditProjectDialog from "../dialogs/edit-project-dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
export default function ProjectsOverview() {
    const session = useSession();
    const { data: projs } = api.user.getUserProjects.useQuery({ uid: session.data?.user?.id ?? "" });
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
            }
        }
    );


    return (
        <>
            {projs?.length ? (
                <div className="flex flex-col gap-2 w-full">
                    {projs.map((proj, index) => (
                        <div key={index} className={`flex items-center gap-2 group  w-full pb-2 ${index === projs.length - 1 ? '' : 'border-b border-gray-200'}`}>
                            <div className="flex items-center gap-2 w-full">
                                {proj.icon ? <img src={proj.icon} alt="project" className="w-6 h-6 border rounded-full object-cover" /> : <div className="w-6 h-6 rounded-full bg-gray-200"></div>}
                                <p key={index} className="text-sm">{proj.title}</p>
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
                            <div className="hover:bg-red-100 flex gap-px items-center p-1 rounded-md cursor-pointer border border-red-200 bg-red-50 text-xs text-red-600" onClick={() => deleteProject({ projectId: proj.id })}>
                                {isDeleting.status && isDeleting.projectId === proj.id ? <Loader2 className="h-4 w-4 animate-spin" /> : ''} Delete
                            </div>
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