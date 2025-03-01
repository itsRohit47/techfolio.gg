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
      <body className="w-full min-h-screen h-full text-sm mx-auto relative ">
        <SessionProviderClientComponent>
          <TRPCReactProvider>
            <AppContextProvider>
              <Analytics />
              <Toaster position="top-right" />
              <div className="w-full h-full bg-gradient-to-br from-sky-100 -z-20  fixed top-1/2 left-1/2 rounded-lg -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              <div className="w-full h-full bg-gradient-to-bl from-violet-100 -z-20  fixed top-1/2 left-1/2 rounded-lg -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              {children}
            </AppContextProvider>
          </TRPCReactProvider>
        </SessionProviderClientComponent>
      </body>
    </html>
  );
}



