import Button from "./button";
import { useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmButtonClass = "bg-blue-500 text-white hover:bg-blue-600"
}: ModalProps) {
    const [isAdding, setIsAdding] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                {description && <p className="text-gray-600 mb-6">{description}</p>}
                <div className="flex justify-end gap-4">
                    <Button
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    {onConfirm && (
                        <Button
                            className={`px-4 py-2 rounded-lg ${confirmButtonClass} disabled:opacity-50`}
                            disabled={isAdding}
                            onClick={async () => {
                                setIsAdding(true);
                                onConfirm();
                                setIsAdding(false);
                                onClose();
                            }
                            }
                        >
                            {confirmText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}