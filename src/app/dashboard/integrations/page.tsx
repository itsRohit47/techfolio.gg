/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from "react";
import toast from "react-hot-toast";

export default function IntegrationsPage() {
    const platforms = [
        { name: 'GitHub', icon: '/git.svg', connected: false, category: 'Version Control' },
        { name: 'LeetCode', icon: '/leetcode.jpg', connected: false, category: 'Coding Practice' },
        { name: 'HackTheBox', icon: '/htb.png', connected: false, category: 'Cyber Security' },
        { name: 'TryHackMe', icon: '/thm.jpg', connected: false, category: 'Cyber Security' },
        { name: 'Kaggle', icon: '/kaggle.png', connected: false, category: 'Data Science' },
        { name: 'Roadmap.sh', icon: '/roadmap.png', connected: false, category: 'Learning' },
        { name: 'Careerflow', icon: '/Careerflow.png', connected: true, category: 'Career' },
        { name: 'Medium', icon: '/medium.jpeg', connected: false, category: 'Blogging' },
    ];

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const categories = Array.from(new Set(platforms.map(p => p.category)));

    const handleConnection = (platform: string, isConnected: boolean) => {
        toast.success(`${platform} ${isConnected ? 'disconnected' : 'connected'}`);
        console.log(`${platform} ${isConnected ? 'disconnected' : 'connected'}`);
    };

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

    const filteredPlatforms = platforms.filter(platform =>
        selectedCategories.length === 0 || selectedCategories.includes(platform.category)
    );

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex flex-wrap gap-2 items-center">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => toggleCategory(category)}
                        className={`px-2 py-1 rounded-lg flex items-center gap-2 transition-all duration-300 ease-in-out border
                            ${selectedCategories.includes(category)
                                ? 'bg-blue-100 text-blue-500 hover:bg-blue-200/70 border-blue-500'
                                : 'text-gray-700 hover:bg-blue-100 '
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPlatforms.map((platform) => (
                    <div key={platform.name} className="border rounded-lg p-4 flex items-center justify-between border-gray-300">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-black p-[2px]">
                                <img
                                    src={platform.icon}
                                    alt={platform.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium">{platform.name}</h3>
                                <p className={`text-sm ${platform.connected ? 'text-green-600' : 'text-gray-500'}`}>
                                    {platform.connected ? 'Connected' : 'Not connected'}
                                </p>
                                <span className="text-xs text-gray-400">{platform.category}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleConnection(platform.name, platform.connected)}
                            className={`px-4 py-2 w-28 rounded-md text-sm font-medium ${platform.connected
                                ? ' text-red-600 hover:bg-red-100 border-red-600'
                                : ' text-blue-600 hover:bg-blue-100 border-blue-600'} border`}
                        >
                            {platform.connected ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                ))}
            </div>
        </div >
    );
}