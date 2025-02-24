export enum Size {
  SM = "sm",
  MD = "md",
  LG = "lg",
}

export enum Spacing {
  COMPACT = "compact",
  NORMAL = "normal",
  RELAXED = "relaxed",
}

export type Alignment = "left" | "center" | "right";
export type ColorScheme = "light" | "dark" | "custom";

export interface StyleObject {
  // Layout & Spacing
  layoutSize: Size;
  elementSpacing: Spacing;

  // Header Configuration
  headerAlignment: Alignment;
  showLinks: boolean;
  showDescription: boolean;

  // Colors
  background: string;
  textColor: string;
  nameColor: string;
  descriptionColor: string;
  linkColor: string;

  // Background
  backgroundImage?: string;
  overlayColor?: string;

  // Asset Display
  showTags: boolean;
  categoriseAssets: boolean;
  assetCardChoice: number;
  assetCardBorder: boolean;
  assetCardBorderRadius: string;
  assetCardShadow: boolean;

  // Footer
  showFooter: boolean;

  // Custom Button
  customButton: boolean;
  customButtonColor: string;
  customButtonBackground: string;
  customButtonBorder: string;
  customButtonBorderRadius: string;
  customButtonShadow: boolean;
  customButtonText: string;
  customButtonAlignment: Alignment;
  customButtonSize: "small" | "medium" | "large";
  customButtonLink: string;
  customButtonSameTab: boolean;
}

export const defaultStyle: StyleObject = {
  layoutSize: Size.MD,
  elementSpacing: Spacing.NORMAL,
  headerAlignment: "left",
  showLinks: true,
  showDescription: true,
  background: "bg-white",
  textColor: "text-gray-900",
  nameColor: "text-gray-900",
  descriptionColor: "text-gray-600",
  linkColor: "text-blue-500",
  showTags: true,
  categoriseAssets: true,
  assetCardChoice: 1,
  assetCardBorder: true,
  assetCardBorderRadius: "rounded-md",
  assetCardShadow: true,
  showFooter: true,
  customButton: true,
  customButtonColor: "text-white",
  customButtonBackground: "bg-blue-500",
  customButtonBorder: "border-blue-500",
  customButtonBorderRadius: "rounded-md",
  customButtonShadow: true,
  customButtonText: "View",
  customButtonAlignment: "center",
  customButtonSize: "medium",
  customButtonLink: "",
  customButtonSameTab: true,
};

export const sizeToPixels = {
  [Size.SM]: "16",
  [Size.MD]: "24",
  [Size.LG]: "32",
};

export const sizeMap = {
  image: {
    [Size.SM]: "w-16 h-16",
    [Size.MD]: "w-24 h-24",
    [Size.LG]: "w-28 h-28",
  },
  heading: {
    [Size.SM]: "text-lg",
    [Size.MD]: "text-xl",
    [Size.LG]: "text-2xl",
  },
  text: {
    [Size.SM]: "text-sm",
    [Size.MD]: "text-base",
    [Size.LG]: "text-lg",
  },
  spacing: {
    [Size.SM]: "gap-y-1 p-2",
    [Size.MD]: "gap-y-2 p-4",
    [Size.LG]: "gap-y-4 p-6",
  },
  elementSpacing: {
    [Spacing.COMPACT]: "gap-2", // 0.5rem (8px)
    [Spacing.NORMAL]: "gap-4", // 1rem (16px)
    [Spacing.RELAXED]: "gap-8", // 2rem (32px)
  },
  sectionSpacing: {
    [Spacing.COMPACT]: "gap-4",
    [Spacing.NORMAL]: "gap-8",
    [Spacing.RELAXED]: "gap-12",
  },
};
