export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageDesktop: string;
  imageMobile: string;
  active: boolean;
}

export interface Subcategory {
  id: string;
  title: string;
  description: string;
  image: string;
  redirectLink: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  slug: string;
  image: string;
  headerImage?: string; // Added for category page headers
  subcategories: Subcategory[];
}

export interface Occasion {
  id: string;
  title: string;
  description: string;
  slug: string;
  image: string;
  redirectLink: string;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image: string;
  redirectLink: string;
  active: boolean;
  position: 'home-top' | 'home-middle' | 'home-bottom' | 'category-top' | 'category-bottom' | 'floating';
}

export interface StudioData {
  banners: Banner[];
  categories: Category[];
  occasions: Occasion[];
  advertisements: Advertisement[];
}