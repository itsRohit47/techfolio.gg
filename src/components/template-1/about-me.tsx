'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { UserIcon } from "lucide-react";
import EditCardButton from "../edit-card-button";
import { useState } from "react";

export default function AbouteMe() {
    const session = useSession();
    const { data: useBio } = api.user.getUserBio.useQuery(
        { username: session.data?.user?.username ?? "" }
    );
    const ctx = api.useUtils();
    const { mutate: updateUserBio } = api.user.updateUserBio.useMutation({
        onMutate: async (newData) => {
            await ctx.user.getUserBio.cancel();
            const previousData = ctx.user.getUserBio.getData();
            ctx.user.getUserBio.setData({ username: session.data?.user?.username ?? "" }, { bio: newData.bio });
            return { previousData };
        },
        onError: (err, newData, context) => {
            if (context?.previousData) {
                ctx.user.getUserBio.setData({ username: session.data?.user?.username ?? "" }, context.previousData);
            }
        },
        onSettled: () => {
            void ctx.user.getUserBio.invalidate();
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState(useBio?.bio || "");

    const editBio = () => {
        setIsEditing(true);
        setBio(useBio?.bio || "");
    };

    const saveBio = () => {
        updateUserBio({ bio });
        setIsEditing(false);
    };

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setBio(value);
    };

    return (
        <div className="flex flex-col gap-2  text-xs flex-wrap border min-w-96 h-full lightBg dark:bg-secondary p-3 rounded-lg relative">
            <div className="flex items-center gap-2 mb-3 opacity-70">
                <UserIcon size={16} opacity={.7} />
                <div>About me</div>
                <EditCardButton className="ml-auto" onEdit={editBio} onSave={saveBio} />
            </div>
            {isEditing ? (
                <textarea rows={6} value={bio} onChange={handleChange} className="input-usercard w-full" />
            ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">{useBio?.bio ? useBio.bio : "No bio found"}</p>
            )}
        </div>
    );
}