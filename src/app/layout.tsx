import "@/styles/globals.css";
import AppContextProvider from "@/components/context";
import { TRPCReactProvider } from "@/trpc/react";
import SessionProviderClientComponent from "@/components/SessionProviderClientComponent";
import NextTopLoader from 'nextjs-toploader';

//metadata
import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Home',
    description: 'Home page',
  };
}



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`font-row antialiased`}>
      <body className=" w-full  flex-col flex min-h-screen bg-zinc-100 text-sm">
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


