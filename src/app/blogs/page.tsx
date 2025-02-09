/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon } from "lucide-react";


const articles = [
    {
        title: "Why should you care about your portfolio?",
        description: "What they see is what they believe. Recruiters love seeing your work, and Techfolio.gg makes it easy for them to find you and grow together in our thriving community",
        tags: ["Career"],
        image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "How to get hired in a startup vs a big tech company?",
        description: "Startups generally look for people who are passionate about their work, and are willing to go the extra mile to get things done.",
        tags: ["Career"],
        image: "https://substackcdn.com/image/fetch/w_1200,h_600,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5b8ee285-9b26-4e6e-8dab-9a7cc5d722e3_1600x900.png",
    },
    {
        title: "Comparing web platforms for your portfolio",
        description: "There are many platforms out there to showcase your work, but which one is the best for you?",
        tags: ["Career"],
        image: "https://uploads-ssl.webflow.com/5d5ccddd9a3f387d210a369c/63fc91d6aea19b64dc8f8f39_10%20Popular%20No%20Code%20%26%20Low%20Code%20Platforms%20for%20Website%20and%20App%20Development%20(1).webp",
    },
    {
        title: "Your projects are your assets, the real investment",
        description: "Your work deserves a beautiful presentation. We ensure your projects look their absolute best.",
        tags: ["Career"],
        image: "https://miro.medium.com/v2/resize:fit:680/1*3zwzu2fFptPl1223zYQfiA.jpeg"
    }
];

interface Article {
    title: string;
    description: string;
    tags: string[];
    image: string;
}

function ArticleCard({ article }: { article: Article }) {
    return (
        <div className=" p-2 bg-white  h-96 rounded-sm shadow-sm border group overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <div className="relative overflow-hidden max-h-44 h-full" >
                <img src={article.image} alt={article.title} className="group-hover:scale-110 object-cover w-full h-full transition-all duration-300 group-hover:blur-sm" />
                <div className="w-full h-full bg-black/5 text-white flex items-center justify-center gap-2 transition-all duration-300 absolute inset-0"></div>
                <div className="absolute inset-0 bg-white/20 text-white flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white p-2 rounded-full text-black/80 text-xs">
                        <ArrowUpRightIcon />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 px-2 pb-3 pt-2 h-max">
                {article.tags.map((tag) => (
                    <div key={tag} className="font-row text-xs text-gray-500 mt-2">
                        {tag}
                    </div>
                ))}
                <h2 className="text-xl font-row font-semibold">{article.title}</h2>
                <p className="text-gray-500 line-clamp-4">{article.description}</p>
            </div>
        </div>
    );
}

export default function BlogPage() {
    return (
        <main className="px-4 flex flex-col max-w-7xl mx-auto mb-32">
            <div className=" h-full relative pt-12 pb-12 group flex text-center items-center justify-center px-4">
                <div className="flex flex-col">
                    <h1 className="">Browse our latest blogs</h1>
                    <p className="text-base text-gray-500 max-w-md mt-2">We write about the latest trends in tech, and how you can leverage them to get hired faster.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3 h-full relative items-center justify-center">
                {articles.map((article, i) => (
                    <ArticleCard key={i} article={article} />
                ))}
            </div>
        </main>
    );
}