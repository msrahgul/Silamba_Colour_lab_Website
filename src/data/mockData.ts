// Mock Data for Silamba Colour Lab
// All data is stored and managed via localStorage with these as defaults

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  mobileImage: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  isFeatured?: boolean; // Added for Home Page selection
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  image: string;
  externalUrl: string;
  price?: string;
}


export interface Occasion {
  id: string;
  name: string;
  image: string;
  description: string;
  link?: string; // Field for the redirect URL
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string; // e.g., "Flat 20% OFF"
  image: string;
  link: string;
  code?: string; // e.g., "SUMMER20"
  isActive: boolean;
}

// ... existing defaults (This comment is part of the instruction to locate the area, but in replacement content we just provide the new data)

export const defaultOffers: Offer[] = [
  {
    id: "offer-1",
    title: "Wedding Bundles",
    description: "Premium albums + 2 framed prints",
    discount: "15% OFF",
    image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80",
    link: "/category/wedding",
    code: "WED15",
    isActive: true
  },
  {
    id: "offer-2",
    title: "Custom Mugs",
    description: "Buy 2 Get 1 Free on all magic mugs",
    discount: "B2G1 FREE",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    link: "/category/mugs",
    isActive: true
  }
];

// Changed from defaultBanner to defaultBanners array
export const defaultBanners: Banner[] = [
  {
    id: "banner-1",
    title: "Special Offers",
    subtitle: "Seasonal Sale",
    image: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=1920&q=80",
    mobileImage: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800&q=80",
    ctaText: "Shop Now",
    ctaLink: "/#products",
    isActive: true,
  }
];

export const defaultCategories: Category[] = [
];

export const defaultSubCategories: SubCategory[] = [
  // Photo Frames

];

export const defaultOccasions: Occasion[] = [

];

// Local Storage Keys
export const STORAGE_KEYS = {
  BANNER: "silamba_banner",
  CATEGORIES: "silamba_categories",
  SUBCATEGORIES: "silamba_subcategories",
  OCCASIONS: "silamba_occasions",
  BANNER_SHOWN: "silamba_banner_shown_session",
  ADMIN_AUTH: "silamba_admin_auth",
};

// Helper functions to interact with localStorage
export const getData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
};

export const setData = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

// Initialize data if not present
export const initializeData = (): void => {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(STORAGE_KEYS.BANNER)) {
    localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(defaultBanners[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBCATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.SUBCATEGORIES, JSON.stringify(defaultSubCategories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OCCASIONS)) {
    localStorage.setItem(STORAGE_KEYS.OCCASIONS, JSON.stringify(defaultOccasions));
  }
};
