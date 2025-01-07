import "@/styles/globals.css";
import AppContextProvider from "@/components/context";
import { TRPCReactProvider } from "@/trpc/react";
import SessionProviderClientComponent from "@/components/SessionProviderClientComponent";
import NextTopLoader from 'nextjs-toploader';
import { GeistSans } from "geist/font/sans";


//metadata
import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Tech Portfolio',
    description: 'Build your tech portfolio',
    icons: [{ rel: "icon", url: "/favicon.ico" }],
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
              {children}
            </AppContextProvider>
          </TRPCReactProvider>
        </SessionProviderClientComponent>
      </body>
    </html>
  );
}


