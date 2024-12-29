'use client';
import ClassicDark from "@/templates/Classic/ClassicDark";
import ClassicPortfolio from "@/templates/Classic/ClassicPortfolio";
import ModernPortfolio from "@/templates/Modern/ModernPortfolio";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


function GetTemplate(template: any) {
    switch (template) {
        case 1:
            return <ClassicPortfolio />;
        case 2:
            return <ModernPortfolio />;
        case 3:
            return <ClassicDark />;
        default:
            return <div className="flex justify-center items-center h-screen">
                <h1>Select a template</h1>
            </div>;
    }
}
export default function Preview() {
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
        <div className="-z-10 min-h-screen">
            {GetTemplate(template)}
        </div>
    );
}