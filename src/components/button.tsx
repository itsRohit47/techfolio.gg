export default function Button({
    children,
    className,
    disabled,
    ...props
}: Readonly<{
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}>) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={` px-4 py-2 rounded-lg text-nowrap text-sm ${className}`}
        >
            {children}
        </button>
    );
}