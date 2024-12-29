'use client';
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Loader2, X } from "lucide-react";

export default function AddSkilllsDialog({ onClose }: { onClose: () => void }) {
    const session = useSession();
    const ctx = api.useUtils();
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const { data } = api.user.getUserSkills.useQuery(
        { userId: session.data?.user?.id!! }
    );

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

    const { mutate: addSkill } = api.user.addUserSkill.useMutation(
        {
            onSettled: () => {
                void ctx.user.getUserSkills.invalidate();
                setSelectedSkills([]);
            },
        }
    );
    const { data: skills, isLoading } = api.user.getSkillsBySearch.useQuery({
        search: search,
    });

    const handleAddSkill = (skill: string) => {
        if (!selectedSkills.includes(skill) && !data?.some(userSkill => userSkill.skill.name === skill)) {
            setSelectedSkills([...selectedSkills, skill]);
        }
        setSearch("");
        setShowSuggestions(false);
    };

    const handleSaveSkills = () => {
        setIsSaving(true);
        selectedSkills.forEach(skill => {
            addSkill({ skill }, {
                onSuccess: () => {
                    setIsSaving(false);
                    onClose();
                }
            });
        });
    };

    const handleDeleteSkill = (skillId: string) => {
        deleteUserSkill({ skillId });
    };

    return (
        <div className="">
            <h2 className="text-sm font-bold">Edit Skills</h2>
            <div className="mt-4 relative flex flex-col gap-2">
                <input type="text" placeholder="Skill" className="w-full p-2 border border-gray-200 rounded-md" value={search} onChange={(e) => {
                    setShowSuggestions(true);
                    setSearch(e.target.value);
                }} />
                {showSuggestions && search && (
                    <div className="absolute top-12 z-10 w-full bg-white rounded-md shadow-md p-2 max-h-60 border overflow-auto">
                        {
                            skills?.map((skill) => {
                                const skillExists = data?.some(userSkill => userSkill.skill.name === skill.name);
                                return (
                                    <button key={skill.id} className={`flex items-center justify-between mt-2 p-2 rounded-md w-full ${skillExists ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                        onClick={() => handleAddSkill(skill.name)}
                                        disabled={skillExists}
                                    >
                                        <p>{skill.name}</p>
                                        {skillExists && <span className="text-xs text-gray-500">Already added</span>}
                                    </button>
                                );
                            })
                        }
                        {
                            isLoading && (
                                <div className="flex items-center justify-between mt-2 hover:bg-gray-100 p-2 rounded-md">
                                    <p>Loading...</p>
                                </div>
                            )
                        }
                        {
                            !isLoading && skills?.length === 0 && (
                                <div className="flex items-center justify-between mt-2  p-2 rounded-md w-full">
                                    <p>No skill found related to <span className="font-bold">{search}</span></p>
                                </div>
                            )
                        }
                        {
                            !isLoading && skills && !skills.some(skill => skill.name === search) && (
                                <button className="flex items-center justify-between mt-2 hover:bg-gray-100 p-2 rounded-md w-full" onClick={() => handleAddSkill(search)}>
                                    <p>Add <span className="font-bold">{search}</span></p>
                                </button>
                            )
                        }
                    </div>
                )}
                <div className="flex gap-2 flex-wrap">
                    {
                        data?.map((skill) => (
                            <Badge key={skill.skill.id} className="flex items-center gap-2">
                                {skill.skill.name}
                                <button onClick={() => handleDeleteSkill(skill.skill.id)} className="text-red-500">
                                    <X size={12} />
                                </button>
                            </Badge>
                        ))
                    }
                    {
                        selectedSkills.map((skill, index) => (
                            <Badge key={index} className="flex items-center gap-2 bg-blue-200">
                                {skill}
                                <button onClick={() => setSelectedSkills(selectedSkills.filter((_, i) => i !== index))} className=" text-red-500">
                                    <X size={12} />
                                </button>
                            </Badge>
                        ))
                    }
                </div>
                <div className="flex justify-end">
                    <button className="bg-violet-500 text-white p-2 rounded-md flex items-center disabled:opacity-50" onClick={handleSaveSkills} disabled={isSaving }>
                        {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : ''} Save
                    </button>
                </div>
            </div>
        </div >
    );
}
