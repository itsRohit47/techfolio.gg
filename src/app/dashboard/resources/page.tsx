'use client';
import { useState } from "react";

export default function ResourcesPage() {
    const resources = [
        { name: 'React Docs', href: 'https://react.dev', category: 'Frontend', isPaid: false },
        { name: 'Next.js Documentation', href: 'https://nextjs.org/docs', category: 'Frontend', isPaid: true },
        { name: 'Tailwind CSS', href: 'https://tailwindcss.com', category: 'Styling', isPaid: false },
        { name: 'TypeScript Handbook', href: 'https://www.typescriptlang.org/docs/', category: 'Language', isPaid: false },
        { name: 'Node.js Docs', href: 'https://nodejs.org/docs/latest/', category: 'Backend', isPaid: true },
        { name: 'PostgreSQL Tutorial', href: 'https://www.postgresql.org/docs/', category: 'Database', isPaid: false },
        { name: 'MongoDB University', href: 'https://university.mongodb.com/', category: 'Database', isPaid: true },
        { name: 'AWS Documentation', href: 'https://docs.aws.amazon.com/', category: 'Cloud', isPaid: false },
        { name: 'Docker Docs', href: 'https://docs.docker.com/', category: 'DevOps', isPaid: true },
        { name: 'Kubernetes Docs', href: 'https://kubernetes.io/docs/home/', category: 'DevOps', isPaid: false },
    ];

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const categories = Array.from(new Set(resources.map(r => r.category)));

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
    };

    const filteredResources = resources.filter(resource =>
        selectedCategories.length === 0 || selectedCategories.includes(resource.category)
    );

    return (
        <main className="max-w-5xl">
            <h1 className="text-2xl font-bold">Resources</h1>
            <p className="text-base text-gray-500 max-w-md mt-2">Find all the resources you need to build your portfolio</p>

            <div className="mt-6 flex flex-wrap gap-2 items-center">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`px-2 py-1 rounded-lg flex items-center gap-2 transition-all duration-300 ease-in-out border
                            ${selectedCategories.includes(category)
                                ? 'bg-blue-100 text-blue-500 hover:bg-blue-200/70 border-blue-500'
                                : 'text-gray-700 hover:bg-blue-100'
                            }`}
                    >
                        {category}
                    </button>
                ))}
                {selectedCategories.length > 0 && (
                    <button
                        onClick={clearFilters}
                        className="px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300 ease-in-out border border-red-600"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            <div className="mt-6 space-y-2 flex flex-col">
                {filteredResources.map((resource) => (
                    <div key={resource.href} className="flex items-center gap-2">
                        <a
                            href={resource.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-500 hover:underline"
                        >
                            {resource.name}
                        </a>
                    </div>
                ))}
            </div>
        </main>
    );
}