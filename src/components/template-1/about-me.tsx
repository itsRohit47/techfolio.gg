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
        <div className="flex flex-col gap-2  text-xs flex-wrap h-max  p-3 rounded-lg relative">
            {isEditing ? (
                <textarea rows={6} value={bio} onChange={handleChange} className="input-usercard w-full" />
            ) : (
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 line-clamp-4">{useBio?.bio ? useBio.bio : "No bio found"}</p>
            )}
        </div>
    );
}