'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { MapIcon, LinkIcon } from 'lucide-react';
export default function HeroCard() {
    const session = useSession();
    return (
        <section className="p-4 flex flex-col gap-3 border-dashed border-2 rounded-lg bg-secondary">
            <div className="flex flex-col w-full gap-3">
                <div className="h-36 w-36">
                    <Image src={session.data?.user?.image ?? '/default-profile.png'} alt="profile" width={100} height={100} className="rounded-md border h-full w-full object-cover" />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl">{session.data?.user.name}</h1>
                    <span className="text-base text-tertiary">Cyber security consultant @ Delloite, Australia</span>
                    <div className="flex gap-3 items-center">
                        <div className="flex gap-2 items-center">
                            <MapIcon size={16} />
                            <span className="text-sm text-tertiary">Melbourne</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <LinkIcon size={16} />
                            <a href="https://example.com" className="text-sm hover:underline text-blue-500">itsrohitbajaj</a>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-sm text-tertiary">
                I am a cyber security consultant with 5 years of experience in the field. I have worked with multiple organizations and have helped them secure their systems and networks. I am passionate about cyber security and always looking for new challenges. I am a quick learner and always ready to learn new things.
            </p>
        </section>
    );
}
