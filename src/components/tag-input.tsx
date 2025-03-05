import React, { KeyboardEvent, useRef, useState } from 'react';
import { XIcon } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}

export function TagInput({ tags, setTags, placeholder = 'Add tags...', maxTags = 6 }: TagInputProps) {
    const [input, setInput] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
            setTags([...tags, trimmedTag]);
            setInput('');
        }
    };

    const removeTag = (indexToRemove: number) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input) {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const focusInput = () => {
        const input = containerRef.current?.querySelector('input');
        if (input) input.focus();
    };

    return (
        <div
            ref={containerRef}
            onClick={focusInput}
            className="flex flex-wrap items-center gap-2 p-2 border border-gray-200 rounded bg-white min-h-[42px] cursor-text"
        >
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTag(index);
                        }}
                        className="hover:text-red-500 focus:outline-none"
                    >
                        <XIcon size={14} />
                    </button>
                </span>
            ))}
            {tags.length < maxTags && (
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 outline-none bg-transparent min-w-[120px]"
                />
            )}
        </div>
    );
}
