/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react"
import { useSession } from "next-auth/react";
import { CodeIcon, ExpandIcon } from "lucide-react";
import { useState } from "react";
import EditCardButton from "../edit-card-button";
import MyDrawer from "./my-drawer";
import { TrashIcon, TextIcon } from "lucide-react";

interface Project {
    id: string;
    title: string;
    description: string | null;
    body: string | null;
    skills: { name: string }[];
}

function ProjectItem({ proj }: { proj: Project }) {
    const [isEditing, setIsEditing] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const session = useSession();

    const ctx = api.useUtils();
    const { mutate: deleteUserProject } = api.user.deleteUserProject.useMutation({
        onMutate: async (id) => {
            await ctx.user.getUserProjects.cancel();
            const previousData = ctx.user.getUserProjects.getData();
            if (previousData) {
                ctx.user.getUserProjects.setData({ uid: session.data?.user?.id ?? "" }, previousData.filter((proj: { id: string }) => proj.id !== id.projectId));
            }
            return { previousData };
        },
        onError: (err, id, context) => {
            alert(err);
            if (context?.previousData) {
                ctx.user.getUserProjects.setData({ uid: session.data?.user?.id ?? "" }, context.previousData);
            }
        },
        onSettled: () => {
            void ctx.user.getUserProjects.invalidate();
        }
    });

    const handleToggle = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <MyDrawer title={proj.title} des={proj.description!} body={proj.body!}>
            <div className={`group overflow-auto transition-colors duration-300 ease-in ${!isEditing && 'hover:dark:bg-secondary/60'} cursor-pointer dark:bg-secondary/40 lightBg group flex w-full min-w-[400px] text-sm flex-col gap-px items-start p-4 rounded-md relative text-left`}>
                <EditCardButton className="absolute bottom-4 right-4" onEdit={() => { setIsEditing(!isEditing) }} onSave={() => { setIsEditing(!isEditing) }} />
                <div className="text-lg">{proj.title}</div>
                <div className="text-gray-700 dark:text-gray-300 font-extralight text-sm max-w-80 flex-grow line-clamp-2">{proj.description}</div>
                <div className="flex items-center mt-5 flex-wrap">
                    {proj.skills.map((skill: any, index: number) => (
                        <div key={index}>
                            <div className="text-xs text-gray-700 dark:text-gray-400">
                                {skill.name.toUpperCase()}
                                {index !== proj.skills.length - 1 && <span className="px-2">•</span>}
                            </div>
                        </div>
                    ))}
                </div>
                {isEditing ? <>
                    <TrashIcon size={20} className="cursor-pointer bg-red-500/30 border-red-500 rounded-sm text-red-500 p-1 absolute right-3 top-3" onClick={(e) => {
                        e.stopPropagation();
                        deleteUserProject({ projectId: proj.id });
                    }} />
                    <TextIcon size={20} className="cursor-pointer bg-blue-500/30 border-blue-500 rounded-sm text-blue-500 p-1 absolute right-10 top-3" onClick={() => { console.log('') }} />
                </> :
                    <ExpandIcon className="group-hover:scale-110 absolute right-3 top-3 transition duration-300 cursor-pointer p-[2px]  hover:bg-tertiary/50 rounded-sm" strokeWidth={1} size={18} onClick={() => handleToggle(proj.id)} />}
            </div>
        </MyDrawer>
    );
}

export default function ProjectsOverview() {
    const session = useSession();
    const { data: projs } = api.user.getUserProjects.useQuery({ uid: session.data?.user?.id ?? "" });


    return (
        <section className="flex gap-4 overflow-auto h-max  w-s ">
            {projs?.length ? (
                projs.map((proj, index) => (
                    <ProjectItem key={index} proj={proj} />
                ))
            ) : (
                    <div className="text-xs border w-full p-10 rounded-lg flex items-center justify-center flex-col gap-3">
                        <CodeIcon size={24}  />
                        <h1 className="text-xl font-bold">No projects found</h1>
                        <p className="text-base text-gray-500">Add your projects to showcase your skills</p>
                        <button className="border hover:bg-gray-50 dark:bg-secondary px-2 py-1 rounded-md text-sm">Add Project</button>
                </div>
            )}
        </section>
    );
}