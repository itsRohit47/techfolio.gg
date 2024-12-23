import CertsOverview from "@/components/template-1/certs-overview";
import EducationPage from "@/components/template-1/edu-page";
import ExperienceOverview from "@/components/template-1/experience-overview";
import ProjectsOverview from "@/components/template-1/projects-overview";

function getPathContent(path: string) {
    switch (path) {
        case "education":
            return <EducationPage />;
        case "experience":
            return <ExperienceOverview />;
        case "certificates":
            return <CertsOverview />
        case "projects":
            return <ProjectsOverview />;
        default:
            return null;
    }
}

export default function UserPage(
    { params }: { params: { path: string } }
) {
    return (
        <div className="flex flex-col gap-5">
            {getPathContent(params.path)}
        </div>
    )
}