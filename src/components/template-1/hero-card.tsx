'use client';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { api } from '@/trpc/react';
import { ArrowUpRight, SquarePenIcon } from 'lucide-react';
import EditCardButton from '../edit-card-button';
import { useState } from 'react';
import AbouteMe from './about-me';
import ContactCard from './contact-card';


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
        <section className="flex w-full gap-5 items-center p-2" >
            <div className="flex  gap-3 relative h-full w-full">
                <div className="flex gap-5 w-full">
                    <EditCardButton
                        className='hidden absolute top-1 right-2'
                        onEdit={editCard}
                        onSave={saveCard} />
                    <div className="max-w-24 border rounded-full p-1 group lightBg dark:bg-primary relative">
                        <Image src={userBasicData?.image ?? '/avatar.png'} alt="profile" width={100} height={100} className="rounded-full h-full w-full object-cover" />
                        {isEditing &&
                            <label className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 bg-white rounded-full p-1 cursor-pointer">
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
                        <div className="flex gap-1 flex-col w-full">
                            <input autoFocus type="text" placeholder='Full Name' name="name" value={formData.name} onChange={handleChange} className="input-usercard" />
                            <input type="text" placeholder='Headline' name="headline" value={formData.headline} onChange={handleChange} className="input-usercard" />
                            <input type="text" placeholder='Location' name="location" value={formData.location} onChange={handleChange} className="input-usercard" />
                            <input type="text" placeholder='Schedule Link lable (eg. Grab a coffee with me)' name="schedulingLink.label" value={formData.schedulingLink.label} onChange={handleChange} className="input-usercard" />
                            <input type="text" placeholder='eg. cal.com/me' name="schedulingLink.link" value={formData.schedulingLink.link} onChange={handleChange} className="input-usercard text-blue-500" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 ">
                            <h1 className="text-xl text-dark dark:text-white">{userBasicData?.name}</h1>
                            <span className="flex gap-1 items-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400 line-clamp-1">{userBasicData?.headline}</span>
                            </span>
                            <span className="flex gap-1 items-center text-xs">
                                <span className="text-gray-500 dark:text-gray-400">Based in {userBasicData?.location}</span>
                            </span>
                            {userBasicData?.schedulingLink && (
                                <a target='_blank' href={userBasicData.schedulingLink.link} className="text-xs text-blue-500 flex items-center gap-1">
                                    {userBasicData.schedulingLink.label}
                                    <ArrowUpRight size={14} />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section >
    );
}