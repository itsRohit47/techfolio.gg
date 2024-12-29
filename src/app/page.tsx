'use client';
import { signOut, useSession, signIn } from "next-auth/react";
export default function Home() {
  const { data } = useSession();

  if (!data) {
    return (
      <main className="p-4">
        <h1>Not signed in</h1>
        <button onClick={() => signIn()}>Sign in</button>
      </main>
    );
  }

  return (
    <main className="p-4">
      hello
      <button onClick={() => signOut()}>Sign out</button>
    </main >
  );
}