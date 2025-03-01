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
  nameColor: string;
  descriptionColor: string;
  locationColor: string;
  linkColor: string;

  // Background
  backgroundImage?: string;
  backgroundOverlay: string;

  // Asset Display
  showAssetIcon: boolean;
  showAssetDescription: boolean;
  showAssetType: boolean;

  // Asset Card Settings
  assetCardStyle: string;
  assetCardBackground: string;
  assetCardTextColor: string;
  assetCardDescriptionColor: string;
  assetCardBorder: boolean;
  assetCardBorderColor: string;
  assetCardBorderWidth: string;
  assetCardBorderRadius: string;
  assetCardShadow: boolean;
  assetCardHoverShadow: boolean;
  assetCardHoverScale: boolean;

  // Header
  headerStyle: string;

  // Location
  showLocation: boolean;

  // Asset Visibility
  showAssets: boolean;

  // Footer Settings
  showFooter: boolean;
  footerFixed: boolean;
  footerBackground: string;
  footerBorder: boolean;
  footerBorderColor: string;
  footerBorderWidth: string;
  footerShadow: boolean;
  footerPadding: string;

  // Footer Button
  footerButtonText: string;
  footerButtonUrl: string;
  footerButtonColor: string;
  footerButtonBg: string;
  footerButtonBorder: boolean;
  footerButtonBorderColor: string;
  footerButtonRadius: string;
  footerButtonShadow: boolean;
  footerButtonHoverScale: boolean;
  footerButtonType: "link" | "email" | "phone";
  footerButtonEmail: string;
  footerButtonPhone: string;

  // Asset Categorization
  categorizeAssets: boolean;
  assetTabBackground: string;
  assetTabSelectedBg: string;
  assetTabTextColor: string;
  assetTabSelectedTextColor: string;

  // Asset Tab Navigation
  assetTabBorder: boolean;
  assetTabBorderColor: string;
  assetTabHoverBg: string;
  assetTabBorderRadius: string;
  assetTabPadding: string;
  assetTabSpacing: string;
  assetTabShadow: boolean;

  // Email
  showEmail: boolean;
}

export const defaultStyle: StyleObject = {
  layoutSize: Size.MD,
  elementSpacing: Spacing.COMPACT,
  headerAlignment: "center",
  showLinks: true,
  showDescription: true,
  background: "#2d2d2d",
  nameColor: "#000000",
  descriptionColor: "#000000",
  locationColor: "#000000",
  linkColor: "#000000",
  backgroundImage:
    "https://images.unsplash.com/photo-1623654667000-bb54577193a7?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  backgroundOverlay: "bg-black/10",
  headerStyle: "default",
  assetCardStyle: "default",
  assetCardBackground: "#cbcbcb",
  assetCardTextColor: "#120202",
  assetCardDescriptionColor: "#322a2a",
  assetCardBorder: true,
  assetCardBorderColor: "#a3a3a3",
  assetCardBorderWidth: "1px",
  assetCardBorderRadius: "rounded-lg",
  assetCardShadow: true,
  assetCardHoverShadow: true,
  assetCardHoverScale: true,
  showAssetIcon: false,
  showAssetDescription: true,
  showAssetType: true,
  showLocation: true,
  showAssets: true,

  // Footer Settings
  showFooter: true,
  footerFixed: true,
  footerBackground: "#2d2d2d",
  footerBorder: true,
  footerBorderColor: "#E5E7EB",
  footerBorderWidth: "1px",
  footerShadow: false,
  footerPadding: "py-4",

  // Footer Button
  footerButtonText: "Follow me on LinkedIn",
  footerButtonUrl: "linkedin.conm/in/itsrohitbajaj",
  footerButtonColor: "#000000",
  footerButtonBg: "#cbcbcb",
  footerButtonBorder: false,
  footerButtonBorderColor: "#2563EB",
  footerButtonRadius: "rounded-full",
  footerButtonShadow: true,
  footerButtonHoverScale: true,
  footerButtonType: "link",
  footerButtonEmail: "",
  footerButtonPhone: "",

  // Asset Categorization
  categorizeAssets: false,
  assetTabBackground: "#8f8f8f",
  assetTabSelectedBg: "#d6d6d6",
  assetTabTextColor: "#6B7280",
  assetTabSelectedTextColor: "#111827",

  // Asset Tab Navigation
  assetTabBorder: true,
  assetTabBorderColor: "#bababa",
  assetTabHoverBg: "#d6d6d6",
  assetTabBorderRadius: "rounded-full",
  assetTabPadding: "px-4 py-2",
  assetTabSpacing: "gap-2",
  assetTabShadow: false,

  // Email
  showEmail: true,
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
