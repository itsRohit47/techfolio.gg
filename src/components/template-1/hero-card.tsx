'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { api } from '@/trpc/react';
import { SquarePenIcon } from 'lucide-react';
import EditCardButton from '../edit-card-button';
import { useState } from 'react';

export default function HeroCard() {
    const username = usePathname().split('/')[1]!;
    const { data: userBasicData } = api.user.getUserBasicData.useQuery({
        username: username
    });
    const ctx = api.useUtils();
    const { mutate: updateUserBasicData } = api.user.updateUserBasicData.useMutation({
        onMutate: async (newData) => {
            await ctx.user.getUserBasicData.cancel();
            const previousData = ctx.user.getUserBasicData.getData();
            ctx.user.getUserBasicData.setData({ username }, { ...newData, id: userBasicData?.id ?? '', schedulingLink: { ...newData.schedulingLink, userId: userBasicData?.schedulingLink?.userId ?? '', id: userBasicData?.schedulingLink?.id ?? '' } });
            return { previousData };
        },
        onError: (err, newData, context) => {
            if (context?.previousData) {
                ctx.user.getUserBasicData.setData({ username }, context.previousData);
            }
        },
        onSettled: () => {
            void ctx.user.getUserBasicData.invalidate();
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        headline: '',
        location: '',
        schedulingLink: { label: '', link: '' },
        github: '',
        linkedin: '',
        image: '',
        email: ''
    });

    const editCard = () => {
        setIsEditing(true);
        setFormData({
            name: userBasicData?.name || '',
            headline: userBasicData?.headline || '',
            location: userBasicData?.location || '',
            schedulingLink: userBasicData?.schedulingLink ?? { label: '', link: '' },
            github: userBasicData?.github || '',
            image: userBasicData?.image || '',
            email: userBasicData?.email || '',
            linkedin: userBasicData?.linkedin || '',
        });
    };

    const saveCard = () => {
        updateUserBasicData(formData);
        setIsEditing(false);
    };

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <section className="flex w-full items-center relative" >
            <EditCardButton
                className='absolute top-0 -left-8'
                onEdit={editCard}
                onSave={saveCard} />
            <div className="flex h-full w-full">
                <div className="flex w-full gap-3 items-start">
                    <div className="border max-w-24 max-h-24 rounded-lg p-1 group lightBg dark:bg-primary relative">
                        <Image src={userBasicData?.image ?? '/avatar.png'} alt="profile" width={100} height={100} className="rounded-md h-full w-full object-cover" />
                        {isEditing &&
                            <label className="absolute bottom-1/2  right-1/2 translate-x-1/2 translate-y-1/2 bg-white rounded-full p-1 cursor-pointer">
                                <SquarePenIcon className="h-4 w-4 text-gray-500 p-px" />
                                <input type='file' accept="image/png, image/jpeg, image/jpg" className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    console.log(file);
                                    if (file) {
                                        console.log(file);
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        console.log(formData.get('file'));
                                        // const response = await fetch('/api/image/upload', {
                                        //     method: 'POST',
                                        //     headers: {
                                        //         'Content-Type': 'multipart/form-data'
                                        //     },
                                        //     body: formData
                                        // });
                                        alert("Not implemented yet");
                                        // const data = await response.json();
                                        // console.log(data);
                                        // if (response.ok) {
                                        //     setFormData((prev) => ({
                                        //         ...prev,
                                        //         image: URL.createObjectURL(file)
                                        //     }));
                                        // }
                                    }
                                }} />
                            </label>
                        }
                    </div>
                    {isEditing ? (
                        <div className="flex gap-1 flex-col w-full max-w-xl">
                            <input autoFocus type="text" placeholder='Full Name' name="name" value={formData.name} onChange={handleChange} className="input-usercard" />
                            <input type="text" placeholder='Headline' name="headline" value={formData.headline} onChange={handleChange} className="input-usercard" />
                            <input type="text" placeholder='Location' name="location" value={formData.location} onChange={handleChange} className="input-usercard" />
                            <input type="text" placeholder='Github' name="github" value={formData.github} onChange={handleChange} className="input-usercard" />
                            <input type="text" placeholder='LinkedIn' name="linkedin" value={formData.linkedin} onChange={handleChange} className="input-usercard" />
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center">
                            <h1 className="text-3xl">{userBasicData?.name}</h1>
                            <h2 className="text-lg">{userBasicData?.headline}</h2>
                            <h3 className="text-gray-500 dark:text-gray-300 text-sm">{userBasicData?.location}</h3>
                        </div>
                    )}
                </div>
            </div>
        </section >
    );
}