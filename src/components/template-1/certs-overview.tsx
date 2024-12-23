/* eslint-disable @next/next/no-img-element */
'use client';
import { api } from "@/trpc/react"
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ChevronRight, AwardIcon } from "lucide-react";
import EditCardButton from "../edit-card-button";

export default function CertsOverview() {
    const session = useSession();
    const { data: certs } = api.user.getUserCerts.useQuery({ uid: session.data?.user?.id ?? "" });
    const [expanded, setExpanded] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <section className="">
            {certs?.length ? (
                <div className="p-4 rounded-lg lightBg dark:bg-secondary text-xs flex flex-col gap-5">
                    <div className="flex gap-2 mb-2 opacity-70">
                        <AwardIcon size={16} opacity={.7} />
                        <div>Certificates</div>
                        <EditCardButton className="ml-auto" onEdit={() => { console.log('') }} onSave={() => { console.log('') }} />
                    </div>
                    <div className="flex flex-col gap-3">
                        {certs.map((cert) => (
                            <div key={cert.id} className={`flex flex-col group gap-3 items-start justify-between ${certs.indexOf(cert) !== certs.length - 1 ? 'border-b pb-3' : ''}`}>
                                <div className="flex gap-2 items-start justify-between w-full cursor-pointer" onClick={() => handleToggle(cert.id)}>
                                    <div className="flex gap-2 items-center">
                                        {cert.image ? <img src={cert.image} alt={cert.name ?? 'University Logo'} className="w-10 h-10 rounded-full p-px border bg-white object-cover" /> : <div className="w-8 h-8 rounded-full bg-gray-300"></div>}
                                        <div className="flex flex-col gap-1">
                                            <div className="font-semibold flex items-center gap-2">
                                                <div>{cert.name}</div>
                                                <ChevronRight size={14} strokeWidth={1} className={`group-hover:translate-x-1 transition-transform ${expanded === cert.id ? 'rotate-90' : ''}`} />
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 max-w-60">{cert.issuer}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Expiring {cert.issued.getFullYear()}</div>
                                </div>
                                {expanded === cert.id && <div className="text-xs text-gray-500 dark:text-gray-400 my-2">{cert.issuer}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <span className="text-xs">No certificates found</span>
            )}
        </section>
    )
}