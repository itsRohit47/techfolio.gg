'use client';
import { Badge } from "@/components/ui/badge";
import EditCardButton from "../edit-card-button";
import { useState } from "react";
import { X, WrenchIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";

const SkillSection = () => {
    const session = useSession();
    const [showInput, setShowInput] = useState(false);
    const { data: userSkills, isLoading: userSkillsLoading } = api.user.getUserSkills.useQuery(
        { userId: session.data?.user?.id ?? "" }
    );
    const [newSkill, setNewSkill] = useState("");
    const { data: skills, isLoading:
        skillsLoading
    } = api.user.getSkillsBySearch.useQuery(
        { search: newSkill },
        { enabled: newSkill.length > 0 }
    );
    const filteredSkills = skills?.map(skill => ({
        id: skill.id,
        name: skill.name,
        createdAt: skill.createdAt,
        isDisabled: userSkills?.some(userSkill => userSkill.skill.name === skill.name) ?? false
    }));
    console.log(userSkills);
    console.log(session.data?.user?.username);
    const ctx = api.useUtils();

    const { mutate: addUserSkill } = api.user.addUserSkill.useMutation({
        onMutate: async (newData) => {
            setNewSkill('')
            await ctx.user.getUserSkills.cancel();
            const prevData = ctx.user.getUserSkills.getData();
            ctx.user.getUserSkills.setData({ userId: session.data?.user?.id ?? "" }, (old) => {
                if (!old) return [];
                return [...old, { skill: { id: 'temp-id', name: newData.skill, createdAt: new Date() } }];
            });
            return { prevData };
        },
        onError: (_, __, context) => {
            ctx.user.getUserSkills.setData({ userId: session.data?.user?.id ?? "" }, context?.prevData);
        },
        onSettled: () => {
            void ctx.user.getUserSkills.invalidate();
            void ctx.user.getSkillsBySearch.invalidate();
        }
    });

    const { mutate: deleteUserSkill } = api.user.deleteUserSkill.useMutation({
        onMutate: async (deleteData) => {
            await ctx.user.getUserSkills.cancel();
            const prevData = ctx.user.getUserSkills.getData();
            ctx.user.getUserSkills.setData({ userId: session.data?.user?.id ?? "" }, (old) => {
                if (!old) return [];
                return old.filter((skill) => skill.skill.id !== deleteData.skillId);
            });
            return { prevData };
        },
        onError: (_, __, context) => {
            ctx.user.getUserSkills.setData({ userId: session.data?.user?.id ?? "" }, context?.prevData);
        },
        onSettled: () => {
            void ctx.user.getUserSkills.invalidate();
        }
    });

    const saveSkills = () => {
        setShowInput(false);
    }

    const editSkills = () => {
        setShowInput(!showInput);
    };


    return (
        <div className="flex h-max flex-col gap-2  text-xs flex-wrap min-w-96 lightBg dark:bg-secondary  p-3 rounded-lg relative">
            <div className="flex items-center gap-2 mb-3 opacity-70">
                <WrenchIcon size={16} opacity={.7}/>
                <div>Skills</div>
                <EditCardButton className="ml-auto" onEdit={editSkills} onSave={saveSkills} />
            </div>
            {showInput && (
                <div className="flex gap-2 items-center w-full mb-3 relative">
                    <input
                        type="text"
                        value={newSkill}
                        className="p-2 w-full bg-secondary border rounded-lg text-xs"
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Search for a skill"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                addUserSkill({ skill: newSkill });
                            }
                        }}

                    />
                    {newSkill.length > 0 && <div className="flex flex-col gap-2 w-full bg-primary border-2 z-10 rounded-lg p-2 absolute top-10 left-0 max-h-44 overflow-auto">
                        {skillsLoading && <div className="flex flex-col  gap-2 w-full">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="animate-pulse bg-tertiary h-6 rounded-md"></div>
                            ))}
                        </div>}
                        {filteredSkills && filteredSkills.length > 0 && !skillsLoading && filteredSkills.map((skill: { name: string, isDisabled: boolean }, index) => (
                            <button key={index} className={`text-xs text-left w-full hover:bg-tertiary p-2 rounded-md ${skill.isDisabled ? 'opacity-50 hover:bg-transparent pointer-events-none cursor-not-allowed' : ''}`} onClick={() => {
                                if (!skill.isDisabled) {
                                    addUserSkill({
                                        skill: skill.name,
                                    });
                                }
                            }}>
                                <span className="">{skill.name}</span>
                            </button>
                        ))
                        }
                        {filteredSkills && !skillsLoading &&
                            <button onClick={
                                () => {
                                    addUserSkill({ skill: newSkill });
                                }
                            } className="text-xs flex items-center justify-between rounded-md p-2 hover:bg-tertiary"><div>Add <span className="font-bold ml-1">{newSkill}</span></div>
                            </button>}
                    </div>}


                </div >)}

            {userSkillsLoading ? (
                <div className="flex flex-wrap items-center gap-2">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="animate-pulse bg-tertiary h-6 w-20 rounded-md"></div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap items-center gap-2">
                    {userSkills?.length === 0 && <div className="text-secondary text-sm">No skills added</div>}
                    {userSkills?.map((skill, index) => (
                        <Badge key={index} className="flex items-center gap-2">
                            {skill.skill.name}
                            {showInput && (
                                <X
                                    size={14}
                                    className="cursor-pointer bg-secondary rounded-sm p-px hover:bg-red-500"
                                    onClick={() => deleteUserSkill({
                                        skillId: skill.skill.id,
                                    })}
                                />
                            )}
                        </Badge>
                    ))}
                </div>
            )}
        </div >
    );
};

export default SkillSection;
