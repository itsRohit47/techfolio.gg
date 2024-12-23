'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { PlusIcon } from "lucide-react";
const EducationPage = () => {
    const session = useSession();
    const { data: edus } = api.user.getUserEducations.useQuery({ uid: session.data?.user?.id ?? "" });
    return (
        <section >
            {edus?.length ?
                <div className="p-2">Education content</div> :
                <div className="flex gap-3">
                    <div className="p-4 flex flex-col gap-3 border-dashed border-2 rounded-lg bg-secondary w-max text-xs">No education found</div>
                    <button className="p-4 border rounded-lg bg-secondary w-max text-xs">
                        <PlusIcon size={16} />
                    </button>
                </div>}
        </section>
    );
}

export default EducationPage;