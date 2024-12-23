import { useSession } from "next-auth/react";
export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const session = useSession();
    if (!session) return null;
    return children;
}