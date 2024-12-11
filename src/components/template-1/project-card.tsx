import { Badge } from "../ui/badge";
import { ArrowUpRightIcon } from "lucide-react";
import Link from 'next/link';
const Project = () => {
    return (
        <div className="flex flex-col gap-3 p-6 bg-secondary min-w-96 rounded-lg border-dashed border-2 h-max">
            <span className="text-tertiary text-xs">🚀 Recent project</span>
            <h1 className="text-xl font-medium">Automated Penetration Testing Tool, 2021</h1>
            <div className="flex gap-2 flex-wrap">
                <Badge>Python</Badge>
                <Badge>Flask</Badge>
                <Badge>React</Badge>
                <Badge>OWASP</Badge>
            </div>
            <p className="text-tertiary text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elitsed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <div className="flex gap-1 items-center text-blue-500">
                <ArrowUpRightIcon size={16} className="" />
                <Link href="" className="text-xs">View Project</Link>
            </div>
        </div>
    );
}

export default Project;