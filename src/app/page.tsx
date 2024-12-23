'use client';
import { useSession } from "next-auth/react";
import HeroSection from "@/components/landing-page/hero-section";
import Dashboard from "@/components/dashboard/dashboard";


export default function Home() {
  const session = useSession();
  return (
    <div className="flex flex-col items-center justify-center max-w-7xl mx-auto">
      {session.data ? (
        <Dashboard />
      ) : (
        <HeroSection />
      )}
    </div>
  );
}