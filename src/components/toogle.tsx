import React, { useState } from 'react';

interface ToggleProps {
    onToggle?: (value: boolean) => void;
    initialValue?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ onToggle, initialValue = false }) => {
    const [isOn, setIsOn] = useState(initialValue);

    const handleClick = () => {
        setIsOn(!isOn);
        if (onToggle) {
            onToggle(!isOn);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`w-10 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out flex items-center px-1 
            ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
            <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out
                ${isOn ? 'translate-x-4' : 'translate-x-0'}`}
            />
        </div>
    );
};

export default Toggle;