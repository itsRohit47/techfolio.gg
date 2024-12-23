'use client';
import { SquarePenIcon, SaveIcon } from "lucide-react";
import { useAppContext } from "./context";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";

export default function EditCardButton({ onEdit, onSave, className }: { onEdit: () => void, onSave: () => void, className?: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const session = useSession();
    const username = usePathname().split('/')[1]!;
    const { data: uid } = api.user.getUidByUsername.useQuery({
        username: username
    });
    const { isUserPage, setIsUserPage } = useAppContext();


    useEffect(() => {
        if (session.data?.user?.id === uid) {
            setIsUserPage(true);
        } else {
            setIsUserPage(false);
        }
    }, [session.data?.user?.id, setIsUserPage, uid]);

    if (!isUserPage) {
        return null;
    }
    return (
        <>
            {!isEditing ?
                <button onClick={() => {
                    setIsEditing(true);
                    onEdit();
                }} className={`shadow-2xl text-xs flex items-center gap-x-1 dark:text-white transition duration-300  ${isEditing ? 'bg-green-600' : ''} ${className}`}>
                    <SquarePenIcon size={14} opacity={.7} />
                    Edit
                </button> :
                <button onClick={() => {
                    setIsEditing(false);
                    onSave();
                }} className={`shadow-2xl text-xs items-center flex gap-x-1 transition duration-300  ${isEditing ? 'text-green-500' : ''} ${className}`}>
                    <SaveIcon size={14} opacity={.7} />
                    Save
                </button>
            }
        </>
    )
};


