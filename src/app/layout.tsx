'use client';
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import NavBar from "@/components/nav-bar";
import AppContextProvider from "@/components/context";
import { TRPCReactProvider } from "@/trpc/react";
import SessionProviderClientComponent from "@/components/SessionProviderClientComponent";
import NextTopLoader from 'nextjs-toploader';


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="mx-auto h-full max-w-7xl dark py-4  text-xs lg:text-sm dark:bg-primary flex flex-col gap-5 font-light transition-colors duration-300 min-h-screen">
        <SessionProviderClientComponent>
          <TRPCReactProvider>
            <AppContextProvider>
              <NextTopLoader showSpinner={false} color="gray" />
              <NavBar />
              {children}
            </AppContextProvider>
          </TRPCReactProvider>
        </SessionProviderClientComponent>
      </body>
    </html>
  );
}


