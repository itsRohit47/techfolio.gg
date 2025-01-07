'use client';
import { useSession } from "next-auth/react";
import SkillSection from "./sidebar/skills-overview";
import EducationOverview from "./sidebar/edu-overview";
import ExperienceOverview from "./sidebar/experience-overview";
import ProjectsOverview from "./sidebar/projects-overview";
import TemplatesSection from "./sidebar/template-overview";
import { Dialog, DialogTitle } from "./ui/dialog";
import { DialogTrigger } from "./ui/dialog";
import { DialogContent } from "./ui/dialog";
import AddProjectDialog from "./dialogs/add-project-dialog";
import AddEducationDialog from "./dialogs/add-education-dialog";
import AddExperienceDialog from "./dialogs/add-experience-dialog";
import AddBasicInfoDialog from "./dialogs/add-basic-info-dialog";
import AddSkilllsDialog from "./dialogs/add-skills-dialog";
import BasicInfo from "./sidebar/basic-info-overview";
import { useState } from "react";

export default function SideBar({ className }: { className?: string }) {
    const [isBasicInfoDialogOpen, setBasicInfoDialogOpen] = useState(false);
    const [isSkillsDialogOpen, setSkillsDialogOpen] = useState(false);
    const [isProjectDialogOpen, setProjectDialogOpen] = useState(false);
    const [isEducationDialogOpen, setEducationDialogOpen] = useState(false);
    const [isExperienceDialogOpen, setExperienceDialogOpen] = useState(false);

    return (
        <div className={`flex flex-col gap-5 w-max max-w-xl h-screen pb-32 p-5 shadow-2xl bg-gray-50 overflow-auto ${className}`}>
            <div className="flex flex-col gap-2">
                <h1 className="text-base font-bold">Pick a template</h1>
                <TemplatesSection />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-base font-bold">Basic Info</h1>
                    <Dialog open={isBasicInfoDialogOpen} onOpenChange={setBasicInfoDialogOpen}>
                        <DialogTrigger>
                            <div className="hover:bg-stone-100 p-1 rounded-md cursor-pointer border border-stone-200 bg-stone-50 text-xs text-stone-600">
                                Edit Basic Info
                            </div>
                        </DialogTrigger>
                        <DialogContent className="p-4">
                            <DialogTitle className="hidden">
                                Add a project
                            </DialogTitle>
                            <AddBasicInfoDialog onClose={() => setBasicInfoDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
                <BasicInfo />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-base font-bold">Skills</h1>
                    <Dialog open={isSkillsDialogOpen} onOpenChange={setSkillsDialogOpen}>
                        <DialogTrigger>
                            <div className="hover:bg-stone-100 p-1 rounded-md cursor-pointer border border-stone-200 bg-stone-50 text-xs text-stone-600">
                                Edit Skills
                            </div>
                        </DialogTrigger>
                        <DialogContent className="p-4">
                            <DialogTitle className="hidden">
                                Add a project
                            </DialogTitle>
                            <AddSkilllsDialog onClose={() => setSkillsDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
                <SkillSection />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-base font-bold">Projects</h1>
                    <Dialog open={isProjectDialogOpen} onOpenChange={setProjectDialogOpen}>
                        <DialogTrigger>
                            <div className="hover:bg-stone-100 p-1 rounded-md cursor-pointer border border-stone-200 bg-stone-50 text-xs text-stone-600">
                                Add Project
                            </div>
                        </DialogTrigger>
                        <DialogContent className="p-4">
                            <DialogTitle className="hidden">
                                Add a project
                            </DialogTitle>
                            <AddProjectDialog onClose={() => setProjectDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
                <ProjectsOverview />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-base font-bold">Education</h1>
                    <Dialog open={isEducationDialogOpen} onOpenChange={setEducationDialogOpen}>
                        <DialogTrigger>
                            <div className="hover:bg-stone-100 p-1 rounded-md cursor-pointer border border-stone-200 bg-stone-50 text-xs text-stone-600">
                                Add Education
                            </div>
                        </DialogTrigger>
                        <DialogContent className="p-4">
                            <DialogTitle className="hidden">
                                Add an education
                            </DialogTitle>
                            <AddEducationDialog onClose={
                                () => setEducationDialogOpen(false)
                            } />
                        </DialogContent>
                    </Dialog>
                </div>
                <EducationOverview />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-base font-bold">Experience</h1>
                    <Dialog open={isExperienceDialogOpen} onOpenChange={setExperienceDialogOpen}>
                        <DialogTrigger>
                            <div className="hover:bg-stone-100 p-1 rounded-md cursor-pointer border border-stone-200 bg-stone-50 text-xs text-stone-600">
                                Add Experience
                            </div>
                        </DialogTrigger>
                        <DialogContent className="p-4">
                            <DialogTitle className="hidden">
                                Add an experience
                            </DialogTitle>
                            <AddExperienceDialog onClose={
                                () => setExperienceDialogOpen(false)
                            } />
                        </DialogContent>
                    </Dialog>
                </div>
                <ExperienceOverview />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-base font-bold">Others</h1>
                </div>
                <div>
                    Coming soon, certificate, awards, hackathons, achievements, etc, if you think these are super important, let me know, please contact me on  <a href="https://www.linkedin.com/in/itsrohitbajaj" target="_blank" className="text-blue-500">linkedin</a>
                </div>
            </div>
        </div>
    );
}