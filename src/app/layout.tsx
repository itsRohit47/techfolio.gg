import "@/styles/globals.css";
import AppContextProvider from "@/components/context";
import { TRPCReactProvider } from "@/trpc/react";
import SessionProviderClientComponent from "@/components/SessionProviderClientComponent";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Techfolio - Build your tech portfolio',
}



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} scroll-smooth`} >
      <body className="w-full lg:font-row min-h-screen h-full text-sm mx-auto relative bg-gray-100">
        <SessionProviderClientComponent>
          <TRPCReactProvider>
            <AppContextProvider>
              <Analytics />
              <Toaster position="top-right" />
              {/* <div className="w-full h-full bg-gradient-to-br from-sky-100 -z-20  fixed top-1/2 left-1/2 rounded-lg -translate-x-1/2 -translate-y-1/2 blur-2xl"></div> */}
              {/* <div className="w-full h-full bg-gradient-to-bl from-violet-100 -z-20  fixed top-1/2 left-1/2 rounded-lg -translate-x-1/2 -translate-y-1/2 blur-2xl"></div> */}
              {children}
            </AppContextProvider>
          </TRPCReactProvider>
        </SessionProviderClientComponent>
      </body>
    </html>
  );
}



