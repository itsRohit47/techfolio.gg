"use client"
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";

export default function BasicInfo() {
    const session = useSession();
    const { data } = api.user.getUserBasicData.useQuery(
        { username: session.data?.user?.username }
    );

    if (!data) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-md shadow-sm">
            <div className="flex gap-4">
                <div>
                    <img src={session.data?.user.image || '/avatar.png'}
                        alt="avatar" className="rounded-full w-16 h-16" />
                </div>
                <div>
                    <h1 className="text-base font-semibold">{data.name}</h1>
                    <h2 className="text-sm">{data.headline}</h2>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">Bio</span>
                <p className="text-sm">{data.bio}</p>
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">Location</span>
                <p className="text-sm">{data.location}</p>
            </div>
        </div>
    )
}