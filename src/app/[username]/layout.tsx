import HeroCard from "@/components/template-1/hero-card";
import Head from "next/head";

export default function UserLayout(
    { children }: { children: React.ReactNode }
) {
    return (
        <>
            <Head>
                <title>Profile</title>
                <meta name="description" content="Profile" />
            </Head>
            <div className={`grid grid-cols-2 gap-5 p-4`}>
                <HeroCard />
                <div className="col-span-2">
                    {children}
                </div>
            </div>
        </>
    )
}