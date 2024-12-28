import { ArrowUpRightIcon, DownloadCloudIcon } from "lucide-react";
import Link from "next/link";
const Education = () => {
    return (
        <div className="flex flex-col gap-3 p-6 bg-secondary min-w-96 border-dashed border-2 rounded-lg h-max">
            <span className="text-tertiary text-xs">🧑‍🎓 Education</span>
            <h1 className="text-xl">Master of Cyber Security</h1>
            <div className="flex flex-col gap-px">
                <span className="text-sm text-tertiary">Deakin University</span>
                <span className="text-sm text-tertiary">2018 - 2020</span>
                <span className="text-tertiary text-sm">Grade 98%</span>
            </div>
            <p className="text-tertiary text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex gap-2 justify-between items-center mt-3">
                <div className="flex gap-1 justify-between items-center text-blue-500">
                    <ArrowUpRightIcon size={16} className="" />
                    <Link href="" className="text-xs">Read more</Link>
                </div>
                <div className="flex gap-1 items-center text-blue-500">
                    <DownloadCloudIcon size={16} className="" />
                    <button className="text-xs">Academic Transcript</button>
                </div>

            </div>
        </div>
    );
}



export default Education;