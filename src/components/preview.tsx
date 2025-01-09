'use client';
import ClassicPortfolio from "@/templates/Classic/ClassicPortfolio";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PreviewSkeleton from "./skeletons/preview";


function GetTemplate(template: any, username: string) {
    switch (template) {
        case 1:
            return <ClassicPortfolio username={username ?? 'rohit'} />;
        case -1:
            return (
                <div className="flex justify-center items-center h-screen">
                    <h1>More templates, including, generate with AI, coming soon</h1>
                </div>);
        default:
            return (
                <div className="flex justify-center items-center h-screen">
                    <h1>Select a template</h1>
                </div>);
    }
}
export default function Preview({ username }: { username: string }) {
    const { data: session } = useSession();
    const { data } = api.user.getUserTemplate.useQuery(
        { username: session?.user?.username },
    );
    const [template, setTemplate] = useState(data);

    useEffect(() => {
        setTemplate(data);
    }, [data]);

    if (!data) {
        return <PreviewSkeleton />;
    }
    return (
        <div className=" min-h-screen">
            {GetTemplate(template, username)}
        </div>
    );
}