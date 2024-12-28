'use client';
import { useSession } from "next-auth/react";
export default function Home() {
  const { data } = useSession();

  if (!data) {
    return (
      null
    );
  }

  return (
    <main className="p-4">
      hello
    </main >
  );
}