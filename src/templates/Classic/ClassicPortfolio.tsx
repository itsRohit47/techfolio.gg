/* eslint-disable @next/next/no-img-element */
'use client'
import getUserBasicInfo from "@/lib/actions";
import { getUserProjects } from "@/lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
export default function ClassicPortfolio({ username }: { username: string }) {
    return (
        <section className="max-w-xl mx-auto flex justify-center items-center p-4 py-10 md:p-10 w-full flex-col gap-4 h-full min-h-screen">
            <BasicCard username={username} />
            {/* <Tabs defaultValue="projects" className="w-full">
                <TabsList className="transition-all ease-in-out duration-300 flex gap-2">
                    <TabsTrigger value="projects" defaultChecked>Projects</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                </TabsList>
                <TabsContent value="projects" className="p-2"></TabsContent>
                <TabsContent value="education" className="p-2">Change your password here.</TabsContent>
            </Tabs> */}
            <ProjectCard username={username} />
            <button className="mt-2 bg-black text-white px-3 py-2 text-xs rounded-full hover:bg-black/80" onClick={() => window.location.href = 'https://mytechportfolio.vercel.app/'}>
                Build your tech portfolio
            </button>
        </section>
    );
}

function BasicCard({ username }: { username: string }) {
    const { data, isLoading, error } = getUserBasicInfo({ username });
    return (
        <div className="w-full px-2">
            {isLoading &&
                <section className="w-full">
                    <div className="flex gap-4 items-center flex-col text-center">
                        <Skeleton className="w-16 h-16 rounded-full bg-gray-100" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 mt-2 mb-2 text-center">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6 mx-auto" />
                            <Skeleton className="h-4 w-4/6 mx-auto" />
                        </div>
                    </div>
                </section>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <section className="w-full">
                    <div className="flex gap-2 items-center flex-col text-center">
                        <div className="bg-gray-100 rounded-full flex items-center justify-center">
                            <img
                                src={`${data.image}`}
                                alt="avatar"
                                className="rounded-full w-20 h-20 object-cover border border-gray-400 p-px"
                            />
                        </div>
                        <div className="">
                            <h1 className="text-3xl font-bold">{data.name}</h1>
                            <p className="text-gray-500">{data.headline}</p>
                        </div>

                    </div>
                    <div className="flex flex-col gap-4 mt-2 mb-2 text-center">
                        <div className="text-gray-500 prose-sm leading-5 text-sm" dangerouslySetInnerHTML={{ __html: data.bio ?? '' }}></div>
                    </div>
                </section>
            )
            }
        </div >
    );
}

function ProjectCard({ username }: { username: string }) {
    const { data: projects, isLoading: projectsLoading, error } = getUserProjects({ username });
    return (
        <div className="w-full flex-grow h-full">
            {projectsLoading &&
                <div className="flex flex-col gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border cursor-pointer border-gray-200 rounded-xl p-3 flex gap-3 items-center transition-all duration-500 hover:shadow-sm hover:scale-[1.02] hover:-translate-y-[2px] ease-in-out bg-white/20 backdrop-blur-md">
                            <Skeleton className="w-12 h-12 rounded-md" />
                            <div className="flex flex-col gap-1 text-start flex-grow">
                                <div className="font-semibold text-sm flex items-center gap-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-12" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    ))}
                </div>}
            {error && <p>Error: {error.message}</p>}
            {projects && (
                <div className="flex flex-col gap-3">
                    {projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((project) => (
                        <Drawer key={project.id}>
                            <DrawerTrigger className="border cursor-pointer border-gray-300 rounded-xl p-3 flex gap-3 items-center transition-all duration-500 hover:shadow-sm hover:scale-[1.02] hover:-translate-y-[2px] ease-in-out bg-white/20 backdrop-blur-md hover:border-violet-300">
                                <img src={`${project.icon}`} alt={project.title} className="w-12 h-12 object-cover rounded-md border p-px border-gray-200 bg-gray-100" />
                                <div className="flex flex-col gap-1 text-start">
                                    <div className="font-semibold text-sm flex items-center gap-1">
                                        <span className="text-sm line-clamp-1">{project.title}</span>
                                        {project.skills.slice(0, 2).map((skill) => (
                                            <span key={skill.id} className="text-xs bg-gray-100 text-nowrap border font-thin text-gray-700 px-1 ml-1 py-[1px] rounded-md">{skill.name}</span>
                                        ))}
                                        {project.skills.length > 2 && <span className="text-xs bg-gray-100 text-nowrap border font-thin text-gray-700 ml-1 px-2 py-[1px] rounded-sm">...</span>}
                                    </div>
                                    <p className="text-gray-500 line-clamp-1 text-sm">{project.description}</p>
                                </div>
                            </DrawerTrigger>
                            <DrawerContent className="max-w-xl mx-auto max-h-[90vh] ">
                                <DrawerHeader className="px-4 py-4">
                                    <DrawerTitle className="flex gap-4 items-center">
                                        <img src={`${project.icon}`} alt={project.title} className="w-12 h-12 object-cover rounded-md border p-px border-gray-200 bg-gray-100" />
                                        <div className="flex flex-col gap-1 text-left">
                                            {project.title}
                                            <span className="text-gray-500 font-thin text-sm ">{project.description}</span>
                                        </div>
                                    </DrawerTitle>
                                </DrawerHeader>
                                <div className="flex gap-2 px-4 py-2">
                                    {project.skills.map((skill) => (
                                        <span key={skill.id} className="text-xs bg-gray-100 text-nowrap border font-thin text-gray-700 px-2 py-[1px] rounded-md">{skill.name}</span>
                                    ))}
                                </div>
                                <div className="text-gray-500 h-full p-4 overflow-y-auto tiptap relative">
                                    <div dangerouslySetInnerHTML={{ __html: project.body ?? '' }}>
                                    </div>
                                </div>
                                <div className="absolute bottom-12 h-10 w-full bg-gradient-to-t from-white to-transparent" />
                                <DrawerFooter className="px-4 py-2">
                                    <div className="flex gap-2">
                                        <a className="bg-black text-white hover:text-white p-2 rounded-md text-sm text-center w-full hover:bg-black/80" href={`${project.github}`} target="_blank" rel="noreferrer">
                                            Source code
                                        </a>
                                        <a className="bg-blue-600 text-white hover:text-white p-2 rounded-md text-sm text-center w-full hover:bg-blue-00" href={`${project.links}`} target="_blank" rel="noreferrer">
                                            Demo
                                        </a>
                                    </div>
                                </DrawerFooter>
                            </DrawerContent>

                        </Drawer>
                    ))}
                </div>
            )
            }
        </div >
    );
}