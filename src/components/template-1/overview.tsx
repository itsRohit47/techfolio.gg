import Project from "./project-card";
import Education from "./edu-card";
import Blogs from "./blog-card";
const Overview = () => {
    return (
        <section className="lg:grid lg:grid-cols-2 gap-3 flex flex-col">
            <div className="flex flex-col gap-3">
                <Project />
                <Blogs />
            </div>
            <div className="flex flex-col gap-3">
                <Education />
            </div>
        </section>
    );
}
export default Overview;