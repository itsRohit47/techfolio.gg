'use client';
import "@/styles/globals.css";
import AppContextProvider from "@/components/context";
import { TRPCReactProvider } from "@/trpc/react";
import SessionProviderClientComponent from "@/components/SessionProviderClientComponent";
import NextTopLoader from 'nextjs-toploader';
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react"
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { MenuIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/button";
import { Toaster } from 'react-hot-toast';



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} scroll-smooth`} >
      <body className="w-full font-row min-h-screen h-full text-sm mx-auto relative ">
        <SessionProviderClientComponent>
          <TRPCReactProvider>
            <AppContextProvider>
              <Analytics />
              <Toaster position="top-right" />
              <NavBar />
              <div className="w-full h-full bg-gradient-to-br from-sky-100 -z-20  fixed top-1/2 left-1/2 rounded-lg -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              <div className="w-full h-full bg-gradient-to-tl from-violet-100 -z-20  fixed top-1/2 left-1/2 rounded-lg -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              {children}
            </AppContextProvider>
          </TRPCReactProvider>
        </SessionProviderClientComponent>
      </body>
    </html>
  );
}



function NavBar() {
  const { data } = useSession();
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (path.startsWith("/dashboard")) {
    return null;
  }


  return (
    <div
      style={{
        maxWidth: scrolled ? '100%' : '80rem',
      }}
      className={`flex items-center  justify-between mx-auto px-4 py-2 w-full transition-all duration-500 text-black z-50 sticky top-0 mt-4 ${scrolled ? "bg-white border border-b shadow-sm" : ""
        }`}
    >
      <div className="flex items-center space-x-2 w-48 z-50">
        <Link href="/" className="font-medium text-base flex items-center justify-center gap-x-2 font-row">
          <div className="flex items-center justify-center rounded-md bg-blue-900 w-8 h-8 text-base relative overflow-hidden text-white font-row">
            <div className="bg-white/20 w-5 h-10 absolute -right-3 -bottom-2 rotate-45 rounded-md"></div>
            <span>tf</span>
          </div>
          Techfolio.gg
        </Link>
      </div>
      <div className="items-center space-x-4 hidden lg:flex text-black/70 z-50">
        <Link href="/#features" className={`hover:text-black ${path === "#features" ? "text-blue-800" : ""}`}>
          Features</Link>
        <Link href="/#howitworks" className={`hover:text-black ${path === "/howitworks" ? "text-blue-800" : ""}`}>
          How it works</Link>
        <Link href="/#pricing" className={`hover:text-black ${path === "/pricing" ? "text-blue-800" : ""}`}>
          Pricing
        </Link>
      </div>
      <div className="hidden lg:flex items-center space-x-2 w-48 justify-end text-black/70 z-50">
        {data ? (
          <Button onClick={() => { router.push('/dashboard') }} className="bg-blue-800 text-white hover:bg-blue-800/90">Dashboard</Button>
        ) : (
          <>
            <Button onClick={() => signIn()} className="bg-blue-800 text-white hover:bg-blue-800/90">Dashboard</Button>
          </>
        )}
      </div>
      <div className="lg:hidden">
        <MenuIcon size={24} />
      </div>
    </div>
  );
}
