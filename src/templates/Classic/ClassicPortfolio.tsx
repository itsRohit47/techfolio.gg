/* eslint-disable @next/next/no-img-element */
'use client'
import { api } from "@/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GithubIcon, ArrowUpRightIcon, DownloadIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import BlurFade from "@/components/ui/blur-fade";
import PreviewSkeleton from "@/components/skeletons/preview";
import Link from "next/link";


interface BasicCardProps {
    username: string;
    image: string;
    name: string;
    headline: string;
    bio: string;
    linkedin: string;
    github: string;
}

interface ProjectCardProps {
    title: string;
    description: string | null;
    icon: string | null;
    body: string | null;
    links: string | null;
    github: string | null;
    skills: { id: string; name: string }[];
    order: number | null;
    id: string;
}

interface ExperienceCardProps {
    description: string | null;
    location: string;
    startYear: number;
    endYear: number | null;
    title: string;
    order: number | null;
    company: string;
    id: string;
    companyLogo: string | null;
    companyUrl: string | null;
}

interface EducationCardProps {
    startYear: number | null;
    endYear: number | null;
    uniLogo: string | null;
    id: string;
    courseName: string | null;
    fieldOfStudy: string | null;
    universityName: string | null;
    order: number | null;
    academicTranscript: string | null;
    description: string | null;
}

export default function ClassicPortfolio({ username }: { username: string }) {
    const { data, isLoading } = api.user.getUserPortfolio.useQuery({ username });

    if (isLoading) {
        return (
            <PreviewSkeleton />
        );
    }
    return (
        <section className="max-w-lg mx-auto flex justify-center items-center p-4 pt-20 w-full flex-col gap-5 h-full min-h-screen">
            <BasicCard data={{
                username,
                image: data?.image ?? '',
                name: data?.name ?? '',
                headline: data?.headline ?? '',
                bio: data?.bio ?? '',
                linkedin: data?.linkedin ?? '',
                github: data?.github ?? '',
            }} />
            {/* <Tabs defaultValue="projects" className="w-full flex-grow flex flex-col gap-2">
                <TabsList className="transition-all ease-in-out duration-300 flex gap-2">
                    <TabsTrigger value="projects" defaultChecked>Projects</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                </TabsList>
                <TabsContent value="projects" className="">
                    <ProjectCard projects={data?.Projects.map(project => ({
                        ...project,
                        skills: project.skills.map(skill => ({
                            id: skill.skill.id,
                            name: skill.skill.name
                        }))
                    })) ?? []} />
                </TabsContent>
                <TabsContent value="experience" className=" ">
                    <ExperienceCard experiences={data?.Experience.map(experience => ({
                        ...experience,
                    })) ?? []} />
                </TabsContent>
                <TabsContent value="education" className="">
                    <EducationCard educations={data?.education.map(education => ({
                        ...education,
                    })) ?? []} />
                </TabsContent>
            </Tabs> */}
            {/* <div className="flex gap-2 mb-4 flex-wrap items-center justify-center">
                {skills?.map((skill) => (
                    <span key={skill.skill.name} className="text-xs bg-gray-100 text-nowrap border text-gray-600 px-1 rounded-md">{skill.skill.name}</span>
                ))}
            </div> */}
            <ProjectCard projects={data?.Projects.map(project => ({
                ...project,
                skills: project.skills.map(skill => ({
                    id: skill.skill.id,
                    name: skill.skill.name
                }))
            })) ?? []} />
            <button className=" bg-gray-950 fixed h-max bottom-4 right-4 z-20 flex items-center text-white gap-2 px-3 py-2 text-xs rounded-full hover:bg-gray-900" onClick={() => window.location.href = 'https://mytechportfolio.vercel.app/'}>
                <span className="w-4 h-4 bg-gradient-to-br from-red-500 to-green-500 rounded-md inline-block"></span>
                Build your tech portfolio
            </button>
            <div className="flex flex-col gap-2 text-center text-xs text-gray-500 md:items-center justify-center">
                <div className="flex gap-2 text-center text-xs text-gray-500 md:items-center justify-center">
                    <Link href={'/pp'}>
                        Privacy Policy
                    </Link>
                    <div className="text-gray-500">•</div>
                    <Link href={''}>
                        Terms of Service
                    </Link>
                </div>
                <div className="flex gap-1 -translate-y-1 text-center text-xs text-gray-500 items-center justify-center">
                    A product by <a href="https://www.linkedin.com/in/itsrohitbajaj/" target="_blank">Rohit Bajaj</a>
                </div>
            </div>
        </section>
    );
}

function BasicCard({ data }: { data: BasicCardProps }) {
    return (
        <div className="w-full flex flex-col gap-2 items-center">
            <div className="flex gap-2 items-center flex-col text-center">
                <div className="bg-gray-100 rounded-full flex items-center justify-center">
                    <img
                        src={`${data.image}`}
                        alt="avatar"
                        className="rounded-full w-20 h-20 object-cover border border-gray-400 p-px"
                    />
                </div>
                <div className="">
                    <h1 className="text-3xl font-semibold">{data.name}</h1>
                    <p className="text-gray-500 text-sm">{data.headline}</p>
                </div>
            </div>
            <div className="flex flex-col gap-2 text-center max-w-md mx-auto">
                <div className="text-gray-500 prose-sm leading-5 text-sm" dangerouslySetInnerHTML={{ __html: data.bio ?? '' }}></div>
            </div>
        </div >
    );
}

function ProjectCard({ projects }: { projects: ProjectCardProps[] }) {
    console.log(projects);
    return (
        <div className="flex flex-col gap-3 w-full flex-grow">
            {projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((project) => (
                <BlurFade key={project.id} className="w-full" delay={0.1 * (project.order ?? 0)}>
                    <Drawer key={project.id}>
                        <DrawerTrigger className="border w-full cursor-pointer border-gray-300 rounded-xl p-3 flex gap-3 items-center transition-all duration-500 hover:shadow-sm hover:scale-[1.02] hover:-translate-y-[2px] ease-in-out bg-white/20 backdrop-blur-md hover:border-violet-300">
                            <img src={`${project.icon}`} alt={project.title} className="w-12 h-12 object-cover rounded-full p-px border-gray-200 bg-gray-100" />
                            <div className="flex flex-col gap-1 text-start" key={project.id}>
                                <div className="font-semibold text-sm flex items-center gap-1" key={project.id}>
                                    <span className="text-sm line-clamp-1">{project.title}</span>
                                    {project.skills.slice(0, 2).map((skill) => (
                                        <span key={skill.id} className="text-xs bg-gray-100 text-nowrap border font-normal text-gray-700 px-1 ml-1 py-[1px] rounded-md">{skill.name}</span>
                                    ))}
                                    {project.skills.length > 2 && <span className="text-xs bg-gray-100 text-nowrap border font-normal text-gray-700 ml-1 px-2 py-[1px] rounded-sm">...</span>}
                                </div>
                                <p className="text-gray-500 line-clamp-1 text-sm">{project.description}</p>
                            </div>
                        </DrawerTrigger>
                        <DrawerContent className="max-w-xl mx-auto max-h-[90vh]">
                            <DrawerHeader className="">
                                <DrawerTitle className="flex gap-4 items-center px-4 py-2">
                                    <img src={`${project.icon}`} alt={project.title} className="w-12 h-12 object-cover rounded-full border p-px border-gray-200 bg-gray-100" />
                                    <div className="flex flex-col gap-1 text-left items-start ">
                                        {project.title}
                                        <span className="text-gray-500 font-normal text-sm ">{project.description}</span>
                                        <div className="flex gap-2">
                                            {project.skills.map((skill) => (
                                                <span key={skill.id} className="text-xs bg-gray-100 text-nowrap border font-normal text-gray-700 px-2 py-[1px] rounded-sm">{skill.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                </DrawerTitle>
                            </DrawerHeader>
                            <div className="h-full px-4 overflow-y-auto tiptap relative">
                                <div dangerouslySetInnerHTML={{ __html: project.body ?? '' }}>
                                </div>
                            </div>
                            <div className="absolute bottom-12 h-10 w-full bg-gradient-to-t from-white to-transparent" />
                            <DrawerFooter className="px-4 py-2">
                                <div className="flex gap-2">
                                    <button disabled={
                                        !project.github
                                    } className="bg-black flex items-center justify-center gap-2 text-white hover:text-white p-2 rounded-md text-xs text-center w-full hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => window.open(project.github ?? '#', '_blank')}>
                                        <GithubIcon size={12} /> {project.github ? 'Source Code' : 'Work in Progress'}
                                    </button>
                                    <button disabled={!project.links} className="bg-blue-600 flex items-center justify-center gap-2 text-white hover:text-white p-2 rounded-md text-xs text-center w-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => window.open(project.links ?? '#', '_blank')}>
                                        Live Demo <ArrowUpRightIcon size={12} />
                                    </button>
                                </div>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </BlurFade>
            ))}
        </div >
    );
}

function ExperienceCard({ experiences }: { experiences: ExperienceCardProps[] }) {
    return (
        <div className="flex flex-col gap-3 ">
            {experiences.map((experience) => (
                <BlurFade key={experience.id} className="w-full" delay={0.1 * (experience.order ?? 0)}>
                    <Drawer key={experience.id}>
                        <DrawerTrigger className="border w-full cursor-pointer border-gray-300 rounded-xl p-3 flex gap-3 items-center transition-all duration-500 hover:shadow-sm hover:scale-[1.02] hover:-translate-y-[2px] ease-in-out bg-white/20 backdrop-blur-md hover:border-violet-300">
                            <img src={`${experience.companyLogo}`} alt={experience.title} className="w-12 h-12 object-cover rounded-full p-px bg-gray-100" />
                            <div className="flex flex-col gap-1 text-start w-full" key={experience.id}>
                                <div className=" text-sm flex items-center gap-1 justify-between" key={experience.id}>
                                    <span className="text-sm font-semibold line-clamp-1">{experience.title}</span>
                                    <span className="text-sm text-gray-500">{experience.endYear === -1 ? 'Present' : experience.endYear}</span>
                                </div>
                                <p className="text-gray-500 line-clamp-1 text-sm">{experience.company}</p>
                            </div>
                        </DrawerTrigger>
                        <DrawerContent className="max-w-xl mx-auto max-h-[90vh]">
                            <DrawerHeader className="">
                                <DrawerTitle className="flex gap-4 items-center px-4 py-2">
                                    <img src={`${experience.companyLogo}`} alt={experience.title} className="w-12 h-12 object-cover rounded-full border p-px border-gray-200 bg-gray-100" />
                                    <div className="flex flex-col gap-1 text-left">
                                        {experience.title}
                                        <div className="text-gray-500 font-normal text-sm flex flex-col">
                                            {experience.company}
                                            <span className="text-sm">{experience.startYear} - {experience.endYear === -1 ? 'Present' : experience.endYear}</span>
                                        </div>
                                    </div>
                                </DrawerTitle>
                                <div className="flex gap-2 flex-grow flex-col text-left px-4">
                                    <span className="text-sm">{experience.description}</span>
                                </div>
                                <DrawerFooter className="px-4 py-2">
                                    <div className="flex gap-2">
                                        <a className="bg-black flex items-center justify-center gap-2 text-white hover:text-white p-2 rounded-md text-xs text-center w-full hover:bg-black/80" href={`${experience.companyUrl}`} target="_blank" rel="noreferrer">
                                            Company Website
                                        </a>
                                    </div>
                                </DrawerFooter>
                            </DrawerHeader>
                        </DrawerContent>
                    </Drawer>
                </BlurFade>
            ))}
        </div >
    );
}

function EducationCard({ educations }: { educations: EducationCardProps[] }) {
    return (
        <div className="flex flex-col gap-3">
            {educations.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((education) => (
                <BlurFade key={education.id} className="w-full" delay={0.1 * (education.order ?? 0)}>
                    <Drawer key={education.id}>
                        <DrawerTrigger className="border w-full cursor-pointer border-gray-300 rounded-xl p-3 flex gap-3 items-center transition-all duration-500 hover:shadow-sm hover:scale-[1.02] hover:-translate-y-[2px] ease-in-out bg-white/20 backdrop-blur-md hover:border-violet-300">
                            <img src={`${education.uniLogo}`} alt={`education.universityName`} className="w-12 h-12 object-cover rounded-full p-px bg-gray-100" />
                            <div className="flex flex-col gap-1 text-start w-full" key={education.id}>
                                <div className="text-sm flex items-center gap-1 justify-between w-full" key={education.id}>
                                    <span className="text-sm font-semibold line-clamp-1">{education.courseName}</span>
                                    <span className="text-sm line-clamp-1 text-gray-500">{education.endYear === -1 ? 'Present' : education.endYear}</span>
                                </div>
                                <p className="text-gray-500 line-clamp-1 text-sm">{education.fieldOfStudy}</p>
                            </div>
                        </DrawerTrigger>
                        <DrawerContent className="max-w-xl mx-auto max-h-[90vh]">
                            <DrawerHeader className="w-full">
                                <DrawerTitle className="flex gap-4 items-center px-4 py-2 w-full">
                                    <img src={`${education.uniLogo}`} alt={`education.courseName`} className="w-12 h-12 object-cover rounded-full border p-px border-gray-200 bg-gray-100" />
                                    <div className="flex flex-col gap-1 text-left w-full">
                                        <div className="flex items-center gap-1 justify-between" key={education.id}>
                                            {education.courseName}
                                            <span className="text-sm font-normal text-gray-500">{education.startYear} - {education.endYear === -1 ? 'Present' : education.endYear}</span>
                                        </div>
                                        <span className="text-sm font-normal text-gray-500">{education.universityName}</span>
                                        <span className="text-sm font-normal text-gray-500">{education.fieldOfStudy}</span>
                                    </div>
                                </DrawerTitle>
                                <div className="flex gap-2 flex-grow flex-col text-left px-4">
                                    <span className="text-sm">{education.description}</span>
                                </div>
                                <DrawerFooter className="px-4 py-2">
                                    <div className="flex gap-2">
                                        <a className="bg-black flex items-center justify-center gap-2 text-white hover:text-white p-2 rounded-md text-xs text-center w-full hover:bg-black/80" href={`${education.academicTranscript}`} target="_blank" rel="noreferrer">
                                            Academic Transcript <DownloadIcon size={12} />
                                        </a>
                                    </div>
                                </DrawerFooter>
                            </DrawerHeader>
                        </DrawerContent>
                    </Drawer>
                </BlurFade>
            ))}
        </div >
    );
}