'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
export default function TemplatesSection() {
    const session = useSession();
    const { data } = api.user.getUserTemplate.useQuery(
        { username: session.data?.user?.username }
    );
    const ctx = api.useUtils();
    const { mutate: setUserTemplate } = api.user.setUserTemplate.useMutation(
        {
            onMutate: async (newData) => {
                await ctx.user.getUserTemplate.cancel();
                const prevData = ctx.user.getUserTemplate.getData();
                ctx.user.getUserTemplate.setData({ username: session.data?.user?.username ?? "" }, newData.template);
                return { prevData };
            },
            onError: (_, __, context) => {
                ctx.user.getUserTemplate.setData({ username: session.data?.user?.username ?? "" }, context?.prevData);
            },
            onSettled: () => {
                void ctx.user.getUserTemplate.invalidate();
            }
        }
    );
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
    ];

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* radio buttons */}
            <div className="flex gap-2 flex-wrap">
                {templateList.map((template, index) => (
                    <button className={`p-2 text-nowrap text-xs rounded-md bg-gray-200 ${data === template.value ? 'bg-violet-500 text-white' : ''
                        } ${data === template.value ? 'bg-violet-500 text-white' : ''
                        }`} key={index} onClick={() => setUserTemplate({ template: template.value })}>
                        {template.name}
                    </button>
                ))}
            </div>
            {/* get description of the selected templete */}
            <div className="text-sm text-gray-500">
                {templateList.find((template) => template.value === data)?.description}
            </div>
        </div >
    );
}