import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";


const Blog = () => {
    return (
        <Link href="/" className="flex font-thin items-center border-b border-b-white/20 pb-2">
            <span className="text-xl ">How to secure your network from hackers</span>
            <ArrowUpRightIcon size={16} className="" />
        </Link>
    );
}


const Blogs = () => {
    return (
        <div className="flex flex-col h-max gap-3 p-6 bg-secondary min-w-96 border-dashed border-2 rounded-lg">
            <span className="text-tertiary text-xs">📚 Blogs</span>
            <div className=" flex flex-col gap-3">
                <Blog />
            </div>
            <div className="flex gap-2 mt-2 items-center text-blue-500">
                <ArrowUpRightIcon size={16} className="" />
                <Link href="" className="text-xs">Read my blogs</Link>
            </div>
        </div>
    );
}


export default Blogs;