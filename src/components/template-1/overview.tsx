import AbouteMe from "./about-me";
import CertsOverview from "./certs-overview";
import ContactCard from "./contact-card";
import EducationOverview from "./edu-overview";
import ExperienceOverview from "./experience-overview";
import ProjectsOverview from "./projects-overview";
import SkillSection from "./skill-card";
const Overview = () => {
    return (
        <section className="grid grid-cols-3 gap-5">
            <div className="col-span-3">
                <ProjectsOverview />
            </div>
            <div className="col-span-3">
                <div className="grid lg:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-5">
                        <EducationOverview />
                        <CertsOverview />
                        <SkillSection />
                    </div>
                    <div className="flex flex-col gap-5">
                        <ExperienceOverview />
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Overview;