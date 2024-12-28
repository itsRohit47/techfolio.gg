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
                <div onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                    onEdit();
                }} >
                    <SquarePenIcon size={20} className={`shadow-2xl text-xs flex items-center gap-x-1 cursor-pointer bg-blue-500/30 border border-blue-500/50 rounded-sm text-blue-500 p-1 ${className}`} />
                </div> :
                <div onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(false);
                    onSave();
                }} >
                    <SaveIcon size={20} className={`shadow-2xl text-xs items-center flex gap-x-1 cursor-pointer bg-green-500/30 border  border-green-500/50 rounded-sm text-blue-500 p-1  ${isEditing ? 'text-green-500' : ''} ${className}`} />
                </div>
            }
        </>
    )
};


