'use client';
import INeedThis from "@/templates/Classic/ClassicDark";
import ClassicPortfolio from "@/templates/Classic/ClassicPortfolio";
import ModernPortfolio from "@/templates/Modern/ModernPortfolio";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


function GetTemplate(template: any, username: string) {
    switch (template) {
        case 1:
            return <ClassicPortfolio username={username} />;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return <INeedThis caseNum={
                template
            } />;
        case -1:
            return <ModernPortfolio />;
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
        return <div>Loading...</div>;
    }
    return (
        <div className=" min-h-screen">
            {GetTemplate(template, username)}
        </div>
    );
}