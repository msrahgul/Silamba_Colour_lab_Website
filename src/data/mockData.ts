// Mock Data for Silamba Colour Lab
// All data is stored and managed via localStorage with these as defaults

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
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
}

export const defaultBanner: Banner = {
  id: "banner-1",
  title: "Special Offers This Season!",
  subtitle: "Get up to 30% off on all photo frames and wooden gifts. Limited time offer!",
  image: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800&q=80",
  ctaText: "Shop Now",
  ctaLink: "#products",
  isActive: true,
};

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
    localStorage.setItem(STORAGE_KEYS.BANNER, JSON.stringify(defaultBanner));
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
