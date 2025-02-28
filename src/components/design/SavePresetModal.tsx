import { useState } from 'react';
import { StyleObject } from '@/types/common';
import Toggle from '../toogle';

interface SavePresetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, isPublic: boolean, onSuccess?: (themeId: string) => void) => void;
    currentStyle: StyleObject;
}

export default function SavePresetModal({ isOpen, onClose, onSave }: SavePresetModalProps) {
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name) return;
        onSave(name, isPublic);
        setName('');
        setIsPublic(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold mb-4">Save as Preset</h3>
                <input
                    type="text"
                    placeholder="Preset Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                />
                <label className="flex items-center gap-2 mb-4 justify-end">
                    <span className="text-sm text-gray-600">Make preset public</span>
                    <Toggle onToggle={() => { setIsPublic(true) }} />
                </label>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
