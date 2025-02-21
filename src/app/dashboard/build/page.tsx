'use client';
import Button from "@/components/button";
import { useState } from "react";

export default function BuildPage() {
    return (
        <div className="space-y-6">
            <UserAssets />
        </div>
    );
}

const ADD_OPTIONS = [
    { label: 'Project', value: 'project' },
    { label: 'Lab', value: 'lab' },
    { label: 'Assignment', value: 'assignment' },
    { label: 'Article', value: 'article' },
];

function UserAssets() {
    const [showAddOptions, setShowAddOptions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-4">
            <h2 className="font-semibold">Build</h2>
            <div className="flex gap-4 items-center w-full">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search assets"
                    className="flex-1 p-2 border border-gray-200 rounded-lg outline-none"
                />
                <div className="relative">
                    <Button onClick={() => setShowAddOptions(!showAddOptions)}>
                        Add +
                    </Button>
                    {showAddOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                            {ADD_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                        // Handle option selection
                                        setShowAddOptions(false);
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Placeholder for assets list */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold">Asset {i}</h3>
                        <p className="text-gray-600">Asset description...</p>
                    </div>
                ))}
            </div>
        </div>
    );
}