'use client';
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CheckIcon, MenuIcon, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import Button from "@/components/button";
import Image from "next/image";
import toast from "react-hot-toast";
import { api } from "@/trpc/react";

function Popup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Your portfolio awaits! 🚀</h2>
        <p className="text-gray-600 mb-6">
          We&apos;ve crafted a beautiful portfolio template just for you. Start showcasing your work to the world in minutes!
        </p>
        <Button
          onClick={() => signIn()}
          className="w-full bg-blue-800 text-white hover:bg-blue-800/90"
        >
          Create My Portfolio
        </Button>
      </div>
    </div>
  );
}

export default function Home() {
  const { data } = useSession();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (data?.user) {
      router.push("/dashboard/profile?onboarding");
    }
  }, [data, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!data?.user) {
        setShowPopup(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [data?.user]);

  return (
    <main className="max-w-7xl relative mx-auto h-[300px] lg:h-[660px] ">
      <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} />
      <div className="space-y-20 flex flex-col justify-center px-4">
        <NavBar />
        <HeroSection />
        <Features />
        <Pricing />
        <FAQs />
        <Footer />
      </div>
    </main >
  )
}

function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="text-center">
      {/* <Image src="/example1.png" width={800} height={400} alt="Hero" className="w-auto h-[400px] border-2 object-cover rounded-xl absolute rotate-[20deg] -translate-x-60  top-32" /> */}
      {/* <Image src="/example1.png" width={800} height={400} alt="Hero" className="w-auto h-[400px] border-2 object-cover rounded-xl absolute -rotate-[20deg] translate-x-60 right-0 top-32" /> */}
      {/* <div className="w-full h-full bg-white/40 rounded-lg fixed -left-[1000px] -bottom-14 rotate-45  blur-sm -z-10"></div> */}
      <div className="w-full h-full bg-white/40 rounded-lg shadow-sm fixed -right-[600px] top-20 blur-[2px] rotate-45 -z-10"></div>
      <strong>Hurrrrry 🎉 Free until we hit 20 users</strong>
      <h1 className="lg:text-6xl text-5xl font-semibold">Build & share your tech portfolio</h1>
      <p className="mt-3 max-w-xl text-center w-full lg:text-base mx-auto  text-gray-500">Techfolio is an all in one platform for tech professionals, to build a professional technical portfolio, and showcase their work to the world.</p>
      <div className="flex gap-2 mt-4 items-center justify-center mb-10">
        <Link href={'/api/auth/signin'} className="px-4 py-2 bg-gray-900 text-white border shadow-sm text-xs lg:text-sm rounded-md hover:bg-gray-800">Get Started</Link>
        <Link href={'/rohit'} className="px-4 py-2 bg-white text-black border text-xs lg:text-sm shadow-sm rounded-md hover:bg-white/60">View Example</Link>
      </div>
      <div className="bg-white/40 rounded-xl shadow-2xl flex items-center justify-center gap-4 h-[300px] lg:h-[660px] border-2 max-w-5xl mx-auto p-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <iframe
          src="https://www.loom.com/embed/8b5553c99cd5430fa2383c9230b9c3c1?sid=184532ae-1e34-4175-9047-c3bc2114af0c&hideEmbedTopBar=true"
          className="w-full h-full rounded-lg"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>
    </div>
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
    <div className={`p-4 bg-white group rounded-lg shadow-sm group relative  border flex flex-col gap-4 hover:border-gray-400  z-10 ${className} ${plan.title === 'Emerald' ? 'scale-105 z-20 border-violet-300 hover:border-violet-400' : 'scale-100'} transition-all duration-300`}>
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
  const { data: totalUsers, isLoading } = api.asset.getTotalUsers.useQuery();

  return (
    <div>
      <div className="h-max relative flex items-center justify-center flex-col gap-5" id="pricing">
        <div className="flex flex-col justify-center items-center text-center">
          <span className="text-blue-500 font-medium text-sm tracking-wider">PRICING</span>
          <h1 className="text-4xl font-semibold font-row">0$ until we hit 20 users</h1>
          <p className="pg">We&apos;re offering Techfolio for free to the first 20 users. Sign up now to get started, no credit card required.</p>
          <div className="text-gray-500  text-6xl mt-4  h-32 w-full p-2 rounded-lg flex items-center justify-center">
            {isLoading ? "Loading..." : totalUsers ?? 0}/{(totalUsers ?? 0) >= 20 ? "20" : "20"}
          </div>
          <Button onClick={() => signIn()} className="bg-blue-800 text-white hover:bg-blue-800/90 mt-4">Dashboard</Button>
        </div>
        {/* <div className="flex justify-center items-center bg-gray-500/10 p-1 rounded-lg w-max">
          <Button onClick={() => setMonthly(!monthly)} className={`text-gray-600 text-xs  ${monthly ? "text-blue-800  px-5 bg-white" : "hover:bg-gray-100/50"}`}>Monthly</Button>
          <Button onClick={() => setMonthly(!monthly)} className={`text-gray-600 text-xs ${!monthly ? "text-blue-800  px-5 bg-white" : "hover:bg-gray-100/50"}`}>Yearly (save 25%)
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 mx-auto w-full mt-4">
          {PricingPlans.map((plan, i) => (
            <PricingPlan key={i} plan={plan} monthly={monthly} className="group">
              {plan.title === 'Emerald' && <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-tr group-hover:from-violet-100  rounded-lg transition-all duration-300"></div>}
            </PricingPlan>
          ))}
        </div> */}
      </div >
    </div>)
}

function CTA() {
  return (
    <div className="w-full h-60 px-4 text-center bg-blue-900 mb-32 rounded-lg flex items-center justify-center text-white flex-col relative overflow-hidden">
      <div className="w-40 h-96 bg-white/40 rounded-lg absolute -right-[140px] -bottom-16  rotate-45"></div>
      <h1>Not ready to showcase your work?</h1>
      <p className="text-white/80 max-w-md text-center">
        Stay updated with our products, features, and resouces by signing up to our free newsletter
      </p>
      <div className="flex gap-4 mt-4">
        <input type="email" placeholder="Enter your email" className="px-4 py-2  text-black rounded-md w-60" />
        <Button className="bg-white text-black hover:bg-white/90">Subscribe</Button>
      </div>
    </div>
  )
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
      className={`flex items-center justify-between mx-auto py-6 w-full text-black z-50"
        }`}
    >
      <div className={`bg-neutral-100 -translate-y-full border-b-gray-200 border-b-2 py-4 shadow-2xl fixed top-0 w-full left-0 z-[100] flex items-center justify-end gap-4 px-4 transition-all duration-500 ${scrolled ? "translate-y-0" : ""}`}>
        <div className="items-center space-x-4 flex text-black/70 text-xs lg:text-sm z-50">
          <Link href="/#features" className={`hover:text-black ${path === "#features" ? "text-blue-800" : ""}`}>
            Features</Link>
          <Link href="/#howitworks" className={`hover:text-black ${path === "/howitworks" ? "text-blue-800" : ""}`}>
            How it works</Link>
          <Link href="/#pricing" className={`hover:text-black ${path === "/pricing" ? "text-blue-800" : ""}`}>
            Pricing
          </Link>
          <Link href="/#faqs" className={`hover:text-black ${path === "/pricing" ? "text-blue-800" : ""}`}>
            FAQs
          </Link>
        </div>
        <div className="flex items-center space-x-2 justify-end text-black/70">
          {data ? (
            <Button onClick={() => { router.push('/dashboard') }} className="bg-blue-800 text-white hover:bg-blue-800/90">Dashboard</Button>
          ) : (
            <>
              <Button onClick={() => signIn()} className="bg-gray-900 text-white hover:bg-gray-800">Dashboard</Button>
            </>
          )}
        </div>
        {!scrolled && (
          <div className="lg:hidden">
            <MenuIcon size={24} />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 w-48 z-50">
        <Link href="/" className="font-medium text-base flex items-center justify-center gap-x-2 font-row">
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
        <Link href="/#faqs" className={`hover:text-black ${path === "/pricing" ? "text-blue-800" : ""}`}>
          FAQs
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

interface FeatureCardProps {
  title: string;
  description: string;
  image?: string;
  className?: string;
  status?: string;
}

function FeatureCard({ title, description, image, className, status }: FeatureCardProps) {
  return (
    <div className={`bg-gray-200 h-72 w-full flex flex-col justify-center relative border rounded-2xl ${className}`}>
      <div className="absolute top-0 left-0 bg-gradient-to-t from-gray-200 from-20% h-full w-full rounded-2xl"></div>
      {image && <Image src={image} width={2000} height={2000} alt={title} className="w-full h-full object-cover  rounded-2xl" />}
      {status && <div className="absolute top-4 right-4 px-2 border border-black w-max h-max rounded-2xl ">{status}</div>}
      <div className="z-20 absolute bottom-0 left-0 p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}

const featuresList = [
  {
    title: "Beautiful themes",
    description: "Choose from a variety of themes to create a portfolio that matches your style.",
    image: "/ex1.png",
  },
  {
    title: "Custom domains",
    description: "Connect your own domain to make your portfolio truly yours.",
    status: "Coming soon",
    image: "/ex2.png",
  },
  {
    title: "Analytics",
    description: "Track your portfolio's performance with detailed analytics.",
    status: "Coming soon",
    image: "/ex3.jpg",
  },
  {
    title: "SEO Optimization",
    description: "Get discovered by recruiters and potential clients with optimized portfolios.",
    status: "Coming soon",
    image:
      "/ex4.png",
  },
  {
    title: "Mobile Responsive",
    description: "Your portfolio looks great on all devices.",
    image: "/ex5.png",
  },
  {
    title: "Easy Updates",
    description: "Update your portfolio with just a few clicks.",
  }
];

function Features() {
  return (
    <div className="flex flex-col items-center justify-center gap-10" id="features">
      <div className="text-center">
        <span className="text-blue-500 font-medium text-sm tracking-wider">FEATURES</span>
        <h1 className="text-4xl font-semibold font-row">Features you&apos;ll love</h1>
        <p className="pg">Techfolio is packed with features to help you build a professional portfolio, showcase your work and stand out from the crowd.</p>
      </div>
      <div className="w-full space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <FeatureCard {...featuresList[0] as FeatureCardProps} />
          <FeatureCard {...featuresList[1] as FeatureCardProps} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
          {featuresList.slice(2, 5).map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Techfolio?",
      answer: "Techfolio is a platform designed specifically for tech professionals to create and showcase their professional portfolios. It offers easy project management, customizable themes, and tools to highlight your technical achievements."
    },
    {
      question: "Do i need a portfolio to land a job?",
      answer: "Yes! A professional portfolio is a great way to showcase your skills, experience, and projects to potential employers. It's a powerful tool to help you stand out in a competitive job market."
    },
    {
      question: "What can I include in my portfolio?",
      answer: "You can include a variety of content in your portfolio, such as projects, articles, labs, coursework, and certifications. Techfolio offers a range of features to help you create a comprehensive and professional portfolio."
    },
    {
      question: "Do I need to be a developer to use Techfolio?",
      answer: "Techfolio is designed for tech professionals of all levels, from students to industry professionals. You don't need to be a developer to use Techfolio, and our platform is designed to be user-friendly for all skill levels."
    },
    {
      question: "How much does it cost?",
      answer: "Currently, Techfolio is free for the first 20 users! After that, we'll introduce our pricing tiers which include both free and premium options to suit different needs."
    },
    {
      question: "Can I use my own domain?",
      answer: "Custom domain support is coming soon! You'll be able to connect your own domain to make your portfolio truly professional and memorable."
    },
    {
      question: "How do I get started?",
      answer: "Simply click the 'Dashboard' button at the top of the page, sign in with your github, and you can start building your portfolio right away!"
    }
  ];

  return (
    <div className="w-full" id="faqs">
      <div className="text-center mb-10">
        <span className="text-blue-500 font-medium text-sm tracking-wider">FAQs</span>
        <h1 className="text-4xl font-semibold font-row">Frequently Asked Questions</h1>
        <p className="pg">Got questions? We&apos;ve got answers! Here are some common questions about Techfolio.</p>
      </div>
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg"
          >
            <button
              className="w-full p-4 text-left flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-medium">{faq.question}</span>
              <ChevronDown
                className={`transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                size={20}
              />
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t py-8 text-center text-sm text-gray-500">
      <p className="text-gray-400">Made with ❤️ by <a href="https://www.linkedin.com/in/itsrohitbajaj/" target="_blank" className="text-blue-500">Rohit Bajaj</a></p>
    </footer>
  )
}
