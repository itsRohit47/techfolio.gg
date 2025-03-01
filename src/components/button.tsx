export default function Button({
    children,
    className,
    disabled,
    ...props
}: Readonly<{
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => void | Promise<void>;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`
                px-3 py-2
                rounded-lg 
                text-nowrap 
                text-sxs
                transition-colors
                duration-200
                focus:outline-none 
                disabled:opacity-50 
                disabled:cursor-not-allowed
                ${className}`}
        >
            {children}
        </button>
    );
}