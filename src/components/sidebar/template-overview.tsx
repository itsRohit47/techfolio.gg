'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
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
            name: "Classic",
            value: 1
        },
        {
            name: "Modern",
            value: 2
        },
        {
            name: "Classic Dark",
            value: 3
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
                    <button className={`p-2 text-nowrap text-xs rounded-md bg-gray-200 ${data === template.value ? 'bg-violet-500 text-white' : 'text-gray-500'
                        } ${data === template.value ? 'bg-violet-500 text-white' : 'text-gray-500'
                        }`} key={index} onClick={() => setUserTemplate({ template: template.value })}>
                        {template.name}
                    </button>
                ))}
            </div>
        </div >
    );
}