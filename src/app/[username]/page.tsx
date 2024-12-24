'use client'
import HeroCard from '@/components/template-1/hero-card'
import AbouteMe from '@/components/template-1/about-me'
import ProjectsOverview from '@/components/template-1/projects-overview'
import EducationOverview from '@/components/template-1/edu-overview'
import SkillSection from '@/components/template-1/skill-card'
import ExperienceOverview from '@/components/template-1/experience-overview'

export default function UserPage() {
    return (
        <div className="grid grid-cols-8 gap-10 h-full flex-grow">
            <div className="col-span-3 h-full rounded-lg flex flex-col items-center gap-1 w-full">
                <HeroCard />
                <AbouteMe />
                <SkillSection />
            </div>
            <div className='col-span-5 h-full flex flex-col gap-5'>
                <div className="grid gap-5">
                    <ProjectsOverview />
                    <div className="grid grid-cols-2 gap-5">
                        <EducationOverview />
                        <ExperienceOverview />
                    </div>
                </div>
            </div>
        </div >
    )
}