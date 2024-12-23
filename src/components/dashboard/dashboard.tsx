import { useSession } from "next-auth/react";

export default function Dashboard() {
    const { data } = useSession();
    return (
        <div className="p-2 flex flex-col gap-4 w-full">
            <p className="text-4xl ">Welcome, {data?.user.name?.split(' ')[0]} </p>
        </div>
    );
}