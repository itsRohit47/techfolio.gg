/* eslint-disable @next/next/no-img-element */
'use client'
import getUserBasicInfo from "@/lib/actions";
import { getUserProjects } from "@/lib/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
export default function ClassicPortfolio({ username }: { username: string }) {
    const { data: projects } = getUserProjects({ username });
    return (
        <section className="max-w-xl mx-auto flex justify-center items-center p-10 w-full flex-col gap-4 h-full">
            <BasicCard username={username} />
            <ProjectCard username={username} />
        </section>
    );
}

function BasicCard({ username }: { username: string }) {
    const { data, isLoading, error } = getUserBasicInfo({ username });
    return (
        <div className="w-full px-2">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <section className="w-full">
                    <div className="flex gap-4 items-center flex-col text-center">
                        <div className="bg-gray-100 rounded-full flex items-center justify-center">
                            <Image
                                src={`${data.image}`}
                                width={100}
                                height={100}
                                alt="avatar"
                                priority
                                className="rounded-full w-16 h-16 object-cover border border-gray-400 p-px"
                            />
                        </div>
                        <div className="">
                            <h1 className="text-3xl font-bold">{data.name}</h1>
                            <p className="text-gray-500">{data.headline}</p>
                        </div>

                    </div>
                    <div className="flex flex-col gap-4 mt-2 mb-2 text-center">
                        <div className="text-gray-500 prose-sm leading-5" dangerouslySetInnerHTML={{ __html: data.bio ?? '' }}></div>
                    </div>
                </section>
            )
            }
        </div >
    );
}

function ProjectCard({ username }: { username: string }) {
    const { data: projects, isLoading, error } = getUserProjects({ username });
    return (
        <div className="w-full">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {projects && (
                <div className="flex flex-col gap-3">
                    {projects.map((project) => (
                        <Dialog key={project.id}>
                            <DialogTrigger className="border cursor-pointer border-gray-300 rounded-xl p-3 flex gap-3 items-center transition-all duration-500 hover:shadow-sm hover:scale-[1.02] hover:-translate-y-[2px] ease-in-out bg-white/50 backdrop-blur-md hover:border-violet-300">
                                <img src={`${project.icon}`} alt={project.title} className="w-12 h-12 object-cover rounded-md border p-px border-gray-200 bg-gray-100" />
                                <div className="flex flex-col gap-1 text-start">
                                    <div className="font-semibold text-sm flex items-center gap-1">
                                        <span className="text-sm line-clamp-1">{project.title}</span>
                                        {project.skills.slice(0, 2).map((skill) => (
                                            <span key={skill.id} className="text-xs bg-gray-100 text-nowrap border font-thin text-gray-700 px-1 ml-1 py-[1px] rounded-md">{skill.name}</span>
                                        ))}
                                        {project.skills.length > 2 && <span className="text-xs bg-gray-100 text-nowrap border font-thin text-gray-700 ml-1 px-2 py-[1px] rounded-md">...</span>}
                                    </div>
                                    <p className="text-gray-500 line-clamp-1 text-sm">{project.description}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="p-4">
                                <DialogHeader>
                                    <DialogTitle className="flex gap-4 flex-col">
                                        <img src={`${project.icon}`} alt={project.title} className="w-full h-32 object-cover rounded-md border" />
                                        <div className="flex flex-col gap-2 ">
                                            {project.title}
                                            <span className="text-gray-500 font-thin text-sm ">{project.description}</span>
                                        </div>
                                    </DialogTitle>
                                </DialogHeader>
                                    <div className="flex flex-col gap-4 ">
                                        <div className="flex gap-2">
                                            {project.skills.map((skill) => (
                                                <span key={skill.id} className="text-xs bg-gray-100 text-nowrap border font-thin text-gray-700 px-2 py-[1px] rounded-md">{skill.name}</span>
                                            ))}
                                        </div>
                                        <p className="text-gray-500" dangerouslySetInnerHTML={{ __html: project.body ?? '' }}></p>
                                    </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            )}
        </div>
    );
}