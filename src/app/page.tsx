'use client';
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CheckIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import Button from "@/components/button";
import toast from "react-hot-toast";
export default function Home() {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      router.push("/dashboard/build");
    }
  }, [data, router]);



  return (
    <main className="max-w-7xl mx-auto">
      <NavBar />
      <HeroSection />
      {/* <Comparison /> */}
      {/* <Features /> */}
      {/* <Pricing /> */}
      {/* <CTA></CTA> */}
    </main>
  )
}

function HeroSection() {
  return (
    <div className="flex min-h-[70vh] h-full px-4 relative group items-center justify-center">
      <div className="w-full h-full bg-white/40 rounded-lg fixed -left-[1000px] -bottom-14 rotate-45  blur-sm -z-10"></div>
      <div className="w-full h-full bg-white/40 rounded-lg fixed -right-[700px] top-20 rotate-45 -z-10 blur-sm"></div>
      <div className="flex flex-col justify-center relative text-gray-800 items-center text-center">
        <div
          className="text-blue-500 font-extralight text-sm tracking-wider cursor-pointer"
          onClick={() => {
            void navigator.clipboard.writeText('47AI');
            toast.success("Copied to clipboard");
          }}
        >
          Use code <span className="text-base font-bold text-gray-600">#47AI</span> for 20% off 🎉
        </div>
        <h1 className="text-6xl font-semibold font-row">Build & share your tech portfolio</h1>
        <p className="pg">Techfolio is an all in one platform for tech professionals, to build a professional technical portfolio, and showcase their work to the world.</p>
        <div className="flex items-center border mt-4 pl-3 p-2 rounded-lg w-max bg-white/20 border-gray-300">
          <span className="font-medium text-gray-500">techfolio.gg/</span>
          <input type="text" placeholder="username" className=" outline-none bg-transparent w-40 px-[2px] border-none focus:border-none focus:ring-0" />
          {/* <Button onClick={() => signIn("github")} className="bg-blue-800 hover:bg-blue-800/90 text-white">Claim</Button> */}
        </div>
      </div>
    </div >
  )
}


const PricingPlans = [
  {
    title: "Rock",
    description: "Ideal for industry professionals looking for a simple way to showcase their work without the need for advanced design features.",
    price: "$0",
    features: [
      "Unlimited projects",
      "Unlimited storage",
      "Basic analytics",
      "Community access",
    ],
  },
  {
    title: 'Emerald',
    description: "One-time payment for lifetime access and updates. Ideal for professionals who want to invest in their career.",
    price: "$99",
    features: [
      "Unlimited projects",
      "Unlimited storage",
      "Advanced analytics",
      "Community access",
      "Priority support",
      "Lifetime updates",
    ],
  },
  {
    title: "Gold",
    description: "Perfect for students or graduates who want to create a high-quality portfolio with beautiful design elements.",
    price: "$8",
    features: [
      "Unlimited projects",
      "Unlimited storage",
      "Advanced analytics",
      "Community access",
      "Priority support",
    ],
  },
];

interface PricingPlan {
  title: string;
  description: string;
  price: string;
  features: string[];
}

function PricingPlan({ plan, children, className, monthly }: { plan: PricingPlan, children?: React.ReactNode, className?: string, monthly?: boolean }) {
  return (
    <div className={`p-4 bg-white group rounded-lg shadow-sm group relative min-h-96 border flex flex-col gap-4 hover:border-gray-400   ${className} ${plan.title === 'Emerald' ? 'scale-100 border-violet-300 hover:border-violet-400' : 'scale-90'} transition-all duration-300`}>
      {children}
      <div className="text-[80px] px-20 py-32 -rotate-12 transition duration-300 absolute inset-0 w-full opacity-30 grayscale group-hover:grayscale-0 h-full flex items-end justify-end">{plan.title === 'Emerald' ? '🌲' : plan.title === 'Rock' ? '🌿' : plan.title === 'Gold' ? '🪴' : ''}</div>
      <div className="flex flex-col gap-2 h-40 justify-between z-[2]">
        <div className="flex items-center gap-2 justify-between">
          {plan.title === 'Emerald' && <span className="text-xs rounded-full px-2 py-1 bg-violet-500 text-white">Best value</span>}
          {plan.title === 'Gold' && <span className="text-xs rounded-full px-2 py-1 bg-yellow-500 text-white">Most popular</span>}
          {plan.title === 'Rock' && <span className="text-xs rounded-full px-2 py-1 bg-gray-500 text-white">Most basic</span>}
        </div>
        <p className="text-gray-500 pb-4 text-sm">{plan.description}</p>
        <div className="text-3xl font-semibold mt-auto">
          {plan.title === 'Emerald' ? plan.price : (monthly ? plan.price : `$${(parseFloat(plan.price.slice(1)) * 12 * 0.75).toFixed(0)}`)}
          {plan.title !== 'Emerald' && (monthly ? <span className="text-base text-gray-500 font-normal">/month</span> : <span className="text-base text-gray-500 font-normal">/year</span>)}
          {plan.title === 'Emerald' && <span className="text-base text-gray-500 font-normal">/∞</span>}
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-grow py-4 border-b border-t border-gray-200 z-[2]">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-center gap-2">
            <CheckIcon size={16} />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <Button onClick={() => signIn()} className={`z-[3] ${plan.title === 'Emerald' ? 'bg-violet-500 text-white hover:bg-violet-600' : 'bg-gray-200/70 text-gray-800 hover:bg-gray-200 '}`}>
        Get started
      </Button>
    </div>
  );
}

function Pricing() {
  const [monthly, setMonthly] = useState(true);
  return (
    <div>
      <div className="py-32 px-4 h-max relative flex items-center justify-center flex-col gap-5" id="pricing">
        <div className="flex flex-col justify-center items-center text-center">
          <span className="text-blue-500 font-medium text-sm tracking-wider">PRICING</span>
          <h1 className="text-4xl font-semibold font-row">Pay once, use forever</h1>
          <p className="pg">We believe in transparency and simplicity. Pay once, and use the platform forever. No hidden fees, no subscriptions.</p>
        </div>
        <div className="flex justify-center items-center bg-gray-500/10 p-1 rounded-lg w-max">
          <Button onClick={() => setMonthly(!monthly)} className={`text-gray-600 text-xs  ${monthly ? "text-blue-800  px-5 bg-white" : "hover:bg-gray-100/50"}`}>Monthly</Button>
          <Button onClick={() => setMonthly(!monthly)} className={`text-gray-600 text-xs ${!monthly ? "text-blue-800  px-5 bg-white" : "hover:bg-gray-100/50"}`}>Yearly (save 25%)
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 max-w-5xl  mx-auto w-full mt-10">
          {PricingPlans.map((plan, i) => (
            <PricingPlan key={i} plan={plan} monthly={monthly} className="group">
              {plan.title === 'Emerald' && <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-tr group-hover:from-violet-100  rounded-lg transition-all duration-300"></div>}
            </PricingPlan>
          ))}
        </div>
      </div >
    </div>)
}


function CTA() {
  return (
    <div className="w-full h-60 bg-blue-900 mb-32 rounded-lg flex items-center justify-center text-white flex-col relative overflow-hidden">
      <div className="w-40 h-96 bg-white/40 rounded-lg absolute -right-[140px] -bottom-16  rotate-45"></div>
      <h1>Not ready to showcase your work?</h1>
      <p className="text-white/80 max-w-md text-center">
        Stay updated with our products, features, and resouces by signing up to our free newsletter
      </p>
    </div>
  )
}


function Comparison() {

  return (
    <div className="py-32 px-4 h-max relative flex items-center justify-center flex-col gap-5">
      <div className="flex flex-col justify-center items-center text-center">
        <span className="text-blue-500 font-medium text-sm tracking-wider">WHY TECHFOLIO</span>
        <h1 className="text-4xl font-semibold font-row">Comparing website builders</h1>
        <p className="pg">While there are many website builders out there, Techfolio.gg is purpose built for tech professionals to help them stand out and get hired faster.</p>
      </div>

      <div className="grid grid-cols-5 grid-rows-5 border border-dashed h-96 w-full border-gray-400 mt-4">
        <div className="border-b col-span-5 row-span-1 border-gray-400 flex items-center justify-center border-dashed">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
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
