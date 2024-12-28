'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { UserIcon, CornerDownLeft } from "lucide-react";
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
        <div className="relative text-base w-full leading-6 text-gray-700 dark:text-gray-300">
            <EditCardButton className="absolute top-0 -left-8 " onSave={
                saveBio
            } onEdit={
                editBio
            } />
            {isEditing ? (
                <div className="">
                    <textarea rows={7} value={bio} placeholder="I am a graduate from Harvard..." onChange={handleChange} maxLength={500} className="input-usercard w-full" />
                </div>
            ) : (
                <div className="">{useBio?.bio ? <div>

                    {useBio?.bio}
                </div> : <div className="text-xs border w-full p-10 rounded-lg flex items-center justify-center flex-col gap-3">
                    <UserIcon size={24} />
                    <h1 className="text-xl font-bold">No bio added</h1>
                    <p className="text-base text-gray-500">Add a bio to let people know more about you</p>
                    <button className="border hover:bg-gray-50 dark:bg-secondary p-2 rounded-md text-sm" onClick={() => setIsEditing(true)
                    }>Add Bio</button>
                </div>}</div>
            )
            }
        </div >
    );
}