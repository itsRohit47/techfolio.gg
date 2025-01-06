'use client'
import getUserBasicInfo from "@/lib/actions";
import { getUserProjects } from "@/lib/actions";
import { PaperclipIcon, SendIcon } from "lucide-react";
import Image from "next/image";
export default function ClassicPortfolio({ username }: { username: string }) {
    const { data: projects } = getUserProjects({ username });
    return (
        <section className="max-w-xl mx-auto flex justify-center items-center h-full p-10 w-full">
            <BasicCard username={username} />
            {/* {projects?.length} */}
        </section>
    );
}



function BasicCard({ username }: { username: string }) {
    const { data, isLoading, error } = getUserBasicInfo({ username });
    return (
        <div className="w-full">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <section className="border border-gray-200 rounded-xl shadow-sm w-full bg-gradient-to-b from-violet-100 to-white/50">
                    <div className="flex gap-4 p-4 items-center justify-between">
                        <div className="">
                            <h1 className="text-3xl font-bold">{data.name}</h1>
                            <p className="text-gray-500">{data.headline}</p>
                        </div>
                        <div className="bg-gray-100 rounded-full flex items-center justify-center">
                            <Image
                                src={`${data.image}`}
                                width={100}
                                height={100}
                                alt="avatar"
                                priority
                                className="rounded-full w-20 h-20 object-cover border border-gray-400 p-px"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 p-4">
                        <div className="text-gray-500 prose-sm leading-5" dangerouslySetInnerHTML={{ __html: data.bio ?? '' }}></div>
                        <button className="bg-violet-500 text-white text-sm p-2 rounded-md flex items-center disabled:opacity-50 justify-center hover:bg-violet-600">
                            <SendIcon size={14} />
                            <span className="ml-2">Contact</span>
                        </button>
                    </div>
                </section>
            )
            }
        </div >
    );
}