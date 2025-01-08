'use client';
import { signOut, useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
export default function Home() {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      router.push("/admin");
    }
  }, [data, router]);

  if (!data) {
    return (
      <main className="p-4 flex flex-col items-center justify-center h-screen max-w-xl mx-auto text-center">
        <h1 className="text-2xl">Welcome to techfolio.gg</h1>
        <p className="text-gray-600">Techfolio.gg is a platform for tech professionals to showcase their projects, skills, and experiences.</p>
        <div className="flex gap-2 items-center text-center">
          <Link href="https://www.linkedin.com/in/itsrohitbajaj/" target='_blank' rel='noopener noreferrer' className=" mt-4 text-xs bg-gradient-to-r w-max bg-blue-500 hover:bg-blue-600  text-white font-semibold py-2 mx-auto px-4 rounded-full shadow-lg transform transition-all duration-300  flex items-center gap-2 hover:text-white">
            Thoughts?
          </Link>
          <Link href="https://techfolio.gg/rohit" target='_blank' rel='noopener noreferrer' className=" mt-4 text-xs bg-gradient-to-r w-max bg-gray-900 hover:bg-gray-800  text-white font-semibold py-2 mx-auto px-4 rounded-full shadow-lg transform transition-all duration-300  flex items-center gap-2 hover:text-white">
            View example
          </Link>
        </div>
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