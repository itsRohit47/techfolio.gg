"use client"
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function BasicInfo() {
    const session = useSession();
    const { data } = api.user.getUserBasicData.useQuery(
        { username: session.data?.user?.username }
    );

    if (!data) {
        return (
            <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-md shadow-sm animate-pulse">
                <div className="flex gap-4">
                    <div className="bg-gray-100 rounded-full w-16 h-16"></div>
                    <div>
                        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-100">Bio</span>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-100">Location</span>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-md shadow-sm">
            <div className="flex gap-4 items-center">
                <Image src={data.image || '/avatar.png'}
                    width={100}
                    height={100}
                    alt="avatar"
                    className="rounded-full w-10 h-10 object-center object-cover"
                    priority />
                <div>
                    <h1 className="text-base font-semibold">{data.name}</h1>
                    <h2 className="text-sm">{data.headline}</h2>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">Bio</span>
                <p className="text-sm prose-sm" dangerouslySetInnerHTML={{ __html: data.bio ?? '' }} />
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">Location</span>
                <p className="text-sm">{data.location}</p>
            </div>
        </div>
    )
}