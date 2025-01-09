'use client';
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";

const SkillSection = () => {
    const session = useSession();
    const { data: userSkills, isLoading: userSkillsLoading } = api.user.getUserSkills.useQuery(
        { userId: session.data?.user?.id ?? "" }
    );
    return (
        <div className="flex h-max flex-col gap-2 relative">
            {userSkillsLoading ? (
                <div className="flex flex-wrap items-center gap-2 w-full">
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="animate-pulse bg-gray-100 h-6 w-20 rounded-md"></div>
                    ))}
                </div>
            ) : (
                <div className="flex gap-2 flex-wrap relative items-start">
                    {userSkills?.length === 0 && <div className="text-center border w-full p-10 rounded-lg flex items-center justify-center flex-col gap-3">
                        <p className="text-sm text-gray-500">No skills added yet, add your skills to showcase your expertise</p>
                    </div>}
                    {userSkills?.slice(0,7).map((skill, index) => (
                        <Badge key={index} className="flex items-center gap-2">
                            {skill.skill.name}
                        </Badge>
                    ))}
                </div>
            )}
        </div >
    );
};

export default SkillSection;
