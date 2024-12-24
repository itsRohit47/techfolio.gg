/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react"
import { useSession } from "next-auth/react";
import { ChevronRight, CodeIcon } from "lucide-react";
import { useState } from "react";
import EditCardButton from "../edit-card-button";

export default function ProjectsOverview() {
    const session = useSession();
    const { data: projs } = api.user.getUserProjects.useQuery({ uid: session.data?.user?.id ?? "" });
    const [expanded, setExpanded] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <section className="grid grid-cols-3 gap-3">
            {projs?.length ? (
                projs.map((proj, index) => (
                    <div key={index} className="dark:bg-secondary lightBg group flex w-full flex-col gap-3 text-xs items-start p-4 rounded-lg">
                        <div className="flex gap-3 items-center justify-between w-full cursor-pointer" onClick={() => handleToggle(proj.id)}>
                            {proj.icon ? <img src={proj.icon} alt={proj.title ?? 'Project Logo'} className="w-10 h-10 p-1 border dark:border-white/20 rounded-full bg-white/10 object-cover" /> : <div className="flex items-center justify-center border dark:border-white/20 rounded-full p-2 bg-gray-100 dark:bg-secondaryLight"><CodeIcon size={20} className="" strokeWidth={1}></CodeIcon></div>}
                            <div className="flex flex-col gap-1 w-full">
                                <div className="flex gap-2 items-center">
                                    <div className="font-semibold">{proj.title}</div>
                                    <ChevronRight size={14} strokeWidth={1} className={`transition-transform group-hover:translate-x-1 ${expanded === proj.id ? 'rotate-90' : ''}`} />
                                </div>
                                <div className="text-gray-500 dark:text-gray-400">{proj.description}</div>
                            </div>
                        </div>
                        {expanded === proj.id && (
                            <>
                                {proj.skills.length ? (
                                    <div className="flex gap-2">
                                        {proj.skills.map((skill) => (
                                            <div key={skill.id} className="">{skill.name}</div>
                                        ))}
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-xs">No projects found</div>
            )}
        </section>
    )
}