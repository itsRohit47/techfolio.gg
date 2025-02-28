import { StyleObject } from "@/types/common";

interface FooterProps {
    style: StyleObject;
    preview?: boolean;
}

export default function Footer({ style, preview }: FooterProps) {
    if (!style.showFooter) return null;

    const getButtonHref = () => {
        switch (style.footerButtonType) {
            case 'email':
                return `mailto:${style.footerButtonEmail}`;
            case 'phone':
                return `tel:${style.footerButtonPhone}`;
            default:
                return style.footerButtonUrl;
        }
    };

    return (
        <footer
            className={`
            w-full flex
            ${style.footerFixed ? `${preview ? 'sticky pt-10' : 'fixed pt-32 '} p-0 bottom-0 left z-30 px-4 pb-4  ` : ' px-4 pb-4 '}
            `}

            style={{
                ...(style.footerFixed && {
                    background: style.background
                        ? `linear-gradient(to top, ${style.background}, ${style.background}00)`
                        : style.backgroundOverlay && style.backgroundImage
                            ? `linear-gradient(to top, ${style.backgroundOverlay}, ${style.backgroundOverlay}00)`
                            : 'linear-gradient(to top, white, white)'
                })
            }}
        >
            {(style.footerButtonUrl || style.footerButtonEmail || style.footerButtonPhone) && (
                <a
                    href={getButtonHref()}
                    target={style.footerButtonType === 'link' ? "_blank" : undefined}
                    rel={style.footerButtonType === 'link' ? "noopener noreferrer" : undefined}
                    className={`
            w-full text-center inline-flex
            items-center justify-center py-3
            transition-all duration-200 max-w-[550px] mx-auto hover:saturate-200
            ${style.footerButtonRadius}
            ${style.footerButtonBorder ? 'border' : ''}
            ${style.footerButtonShadow ? 'shadow-md' : ''}
            ${style.footerButtonHoverScale ? 'hover:scale-[1.02]' : ''}
            `}
                    style={{
                        color: style.footerButtonColor,
                        backgroundColor: style.footerButtonBg,
                        ...(style.footerButtonBorder && {
                            borderColor: style.footerButtonBorderColor,
                        }),
                    }}
                >
                    {style.footerButtonText}
                </a>
            )}
        </footer>
    );
}
