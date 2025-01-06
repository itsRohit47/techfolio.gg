'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { WandSparklesIcon } from "lucide-react";
export default function TemplatesSection() {
    const session = useSession();
    const { data } = api.user.getUserTemplate.useQuery(
        { username: session.data?.user?.username }
    );
    const ctx = api.useUtils();
    const [newTemplate, setNewTemplate] = useState(data);
    const { mutate: setUserTemplate, isPending } = api.user.setUserTemplate.useMutation(
        {
            onSettled: () => {
                void ctx.user.getUserTemplate.invalidate();
            }
        }
    );

    useEffect(() => {
        setNewTemplate(data);
    }, [data]);
    const templateList = [
        {
            name: "Project Focused",
            description: "This template aims to provide a simple and clean look, focusing on your projects and skills over other information such as education and experience, making it a great choice for students and recent graduates.",
            value: 1
        },
        {
            name: "Experience Focused",
            description: "This template is designed to highlight your work experience and education, making it a great choice for professionals with a lot of experience.",
            value: 2
        },
        {
            name: "Cyber Security",
            description: "Coming soon, this template is designed to highlight your cyber security skills and experience.",
            value: 3
        },
        {
            name: "Data Science",
            description: "Coming soon, this template is designed to highlight your data science skills and experience.",
            value: 4
        },
        {
            name: "Machine Learning",
            description: "Coming soon, this template is designed to highlight your machine learning skills and experience.",
            value: 5
        },
        {
            name: "Software Development",
            description: "Coming soon, this template is designed to highlight your software development skills and experience.",
            value: 6
        },
        {
            name: "Web Development",
            description: "Coming soon, this template is designed to highlight your web development skills and experience.",
            value: 7
        },
        {
            name: "Mobile Development",
            description: "Coming soon, this template is designed to highlight your mobile development skills and experience.",
            value: 8
        },
        {
            name: "Design",
            description: "Coming soon, this template is designed to highlight your design skills and experience.",
            value: 9
        },
        {
            name: "Marketing",
            description: "Coming soon, this template is designed to highlight your marketing skills and experience.",
            value: 10
        },
        {
            name: "Generate with AI",
            description: "Coming soon, this template is generated using AI.",
            value: -1
        },
    ];

    if (!data) {
        return (
            <div className="flex flex-col gap-4">
                {/* Skeleton for radio buttons */}
                <div className="flex gap-2 flex-wrap">
                    <div className="w-24 h-8 bg-gray-100 rounded-md animate-pulse"></div>
                    <div className="w-24 h-8 bg-gray-100 rounded-md animate-pulse"></div>
                    <div className="w-24 h-8 bg-gray-100 rounded-md animate-pulse"></div>
                    <div className="w-24 h-8 bg-gray-100 rounded-md animate-pulse"></div>
                </div>
                {/* Skeleton for description */}
                <div className="w-full h-8 bg-gray-100 rounded-md animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* radio buttons */}
            <div className="flex gap-2 flex-wrap">
                {templateList.map((template, index) => (
                    <button className={`p-2 w-max text-nowrap text-xs rounded-md bg-gray-200 flex items-center gap-x-1 ${isPending && newTemplate === template.value ? 'opacity-50' : ''}
                    ${newTemplate === template.value ? 'bg-violet-500 text-white' : ''}`} key={index} onClick={() => {
                            setNewTemplate(template.value);
                            setUserTemplate({ template: template.value });
                        }}>
                       {template.value === -1 && <WandSparklesIcon size={12}></WandSparklesIcon>} {template.name} {newTemplate === template.value && isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                    </button>
                ))}
            </div>
            {/* get description of the selected templete */}
            <div className="text-sm text-gray-500">
                {isPending ? (
                    <div className="w-full h-8 bg-gray-100 rounded-md animate-pulse"></div>
                ) : (
                    templateList.find((template) => template.value === newTemplate)?.description
                )}
            </div>
        </div >
    );
}