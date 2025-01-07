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
            name: "Minimal",
            description: "A minimalistic template with only the necessary information.",
            value: 1
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