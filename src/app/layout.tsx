import "@/styles/globals.css";
import AppContextProvider from "@/components/context";
import { TRPCReactProvider } from "@/trpc/react";
import SessionProviderClientComponent from "@/components/SessionProviderClientComponent";
import NextTopLoader from 'nextjs-toploader';
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react"


//metadata
import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'TechFolio.gg - Build your tech portfolio',
    description: 'TechFolio.gg is a platform for tech professionals to showcase their projects, skills, and experiences.',
  };
}


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className=" w-full flex-col font-sans flex min-h-screen bg-zinc-100 text-sm">
        <SessionProviderClientComponent>
          <TRPCReactProvider>
            <AppContextProvider>
              <NextTopLoader showSpinner={false} color="gray" />
              <Analytics />
              {children}
            </AppContextProvider>
          </TRPCReactProvider>
        </SessionProviderClientComponent>
      </body>
    </html>
  );
}


