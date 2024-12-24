'use client';
import { useSession } from "next-auth/react";
import Contacts from "@/components/dashboard/contacts";
import { cn } from "@/lib/utils";
import GridPattern from "@/components/ui/grid-pattern";
import { Chart } from "@/components/dashboard/chart";
import RecentEmailActivity from "@/components/dashboard/recent-email-activity";
const stats = [
  {
    title: 'Total Contacts',
    count: 10,
  },
  {
    title: 'Total Emails Sent',
    count: 100,
  },
  {
    title: 'Total Emails Opened',
    count: 50,
  },
  {
    title: 'Pending Follow Ups',
    count: 3,
  }
];

export default function Home() {
  const session = useSession();
  return (
    <div className="grid grid-cols-3 gap-y-10 gap-x-5 ">
      <div className="lightBg col-span-3 flex flex-col  dark:text-white dark:text-white/80 rounded-lg px-8 pt-10 pb-20 relative h-max dark:bg-primary">
        <h1 className="text-base">Dashboard</h1>
        <div className="flex gap-1 items-center">
          {/* add hand hello emoji below*/}
          <h2 className="">Welcome back, </h2>
          <h2>{session.data?.user.name?.split(' ')[0]}</h2>
        </div>
        <div className="flex gap-3 translate-y-10 w-full justify-between absolute bottom-0 left-0 p-5">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col gap-1 border p-3  w-full rounded-lg lightBg dark:bg-primary">
              <h1 className="text-xs text-tertiary flex items-center gap-x-1">{stat.title}</h1>
              <h1 className="text-2xl font-semibold">{stat.count}</h1>
            </div>
          ))}
        </div>
        <GridPattern
          width={20}
          height={20}
          x={-1}
          y={-1}
          strokeDasharray="1"
          className={cn(
            "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)] ",
          )}
        />
      </div>
      <div className="col-span-2">
        <Chart />
      </div>
      <div className="col-span-1 flex flex-col gap-5">
        <Contacts />
        <RecentEmailActivity />
      </div>
    </div>
  );
}