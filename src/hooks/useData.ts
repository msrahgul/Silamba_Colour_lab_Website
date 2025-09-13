import { useState, useEffect } from 'react';
import { StudioData } from '../types';

const STORAGE_KEY = 'photo-studio-data';

interface UseDataReturn {
  data: StudioData | null;
  loading: boolean;
  error: string | null;
  updateData: (newData: StudioData) => void;
  refreshData: () => void;
}

export const useData = (): UseDataReturn => {
  const [data, setData] = useState<StudioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if running in development vs production
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('localhost');

  const validateData = (data: any): data is StudioData => {
    if (!data || typeof data !== 'object') return false;
    
    const requiredFields = ['banners', 'categories', 'occasions', 'advertisements'];
    return requiredFields.every(field => Array.isArray(data[field]));
  };

  const addMissingFields = (data: any): StudioData => {
    // Ensure all required fields exist
    if (!data.advertisements) {
      data.advertisements = [];
    }
    
    if (!data.occasions) {
      data.occasions = [];
    }
    
    // Add headerImage fields to existing categories if missing
    if (data.categories) {
      data.categories = data.categories.map((category: any) => ({
        ...category,
        headerImage: category.headerImage || category.image,
        subcategories: category.subcategories?.map((sub: any) => {
          // Ensure subcategory has all required fields
          return {
            id: sub.id,
            title: sub.title,
            description: sub.description,
            image: sub.image,
            redirectLink: sub.redirectLink
          };
        }) || []
      }));
    }

    return data as StudioData;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isDevelopment) {
        // Development: Try localStorage first, then fallback to data.json
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          console.log('🔧 Loading from localStorage (Development Mode)');
          const parsedData = JSON.parse(storedData);
          const enhancedData = addMissingFields(parsedData);
          setData(enhancedData);
          setLoading(false);
          return;
        }
      }

      // Production or no localStorage data: Load from data.json
      console.log('🌐 Loading from data.json (Production Mode)');
      const response = await fetch('./data.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const jsonData = await response.json();
      
      if (!validateData(jsonData)) {
        throw new Error('Invalid data format in data.json');
      }

      const enhancedData = addMissingFields(jsonData);
      setData(enhancedData);
      
      // In development, also save to localStorage for future use
      if (isDevelopment) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enhancedData));
      }
      
    } catch (fetchError) {
      console.error('Error loading data:', fetchError);
      
      // Fallback to default data structure
      const fallbackData: StudioData = {
  banners: [
    {
      id: "1757745042954",
      title: "Banner 1",
      subtitle: "",
      imageDesktop: "https://www.photoland.in/wp-content/uploads/2025/08/desktop-2025-Aug-premium-photo-frame-1024x323.jpg",
      imageMobile: "https://www.photoland.in/wp-content/uploads/2025/08/mobile-2025-Aug-premium-photo-frame.jpg",
      active: true
    }
  ],
  categories: [
    {
      id: "1757746214019",
      title: "Photo prints",
      description: "",
      slug: "photo-prints",
      image: "https://www.photoland.in/wp-content/uploads/2022/04/Photo-prints-Home-page-510x510.jpg",
      headerImage: "https://www.photoland.in/wp-content/uploads/2019/11/banner_Photo-Printing-1900x450.jpg",
      subcategories: [
        {
          id: "1757747032749",
          title: "Personalized Photo prints",
          description: "Capture life’s special moments with our premium photo prints. Perfect for birthdays, weddings, family gatherings, or festivals, each print is crafted with rich colors and clarity. From small keepsakes to large portraits, these prints preserve your happiest occasions, making them ideal for albums, gifts, and treasured memories.",
          image: "https://www.photoland.in/wp-content/uploads/2023/05/Photo-print-collections-1080x717.jpg",
          redirectLink: "https://www.photoland.in/custom-print/photo-prints/"
        },
        {
          id: "1757748867052",
          title: "Photo Enlargment",
          description: "Transform your favorite memories into stunning photo enlargements. Perfect for home, office, or special gifts, each piece is crafted with vibrant colors and sharp detail. From family portraits to artistic shots, these enlargements make any space more personal and eye-catching, creating lasting impressions and treasured keepsakes.",
          image: "https://www.photoland.in/wp-content/uploads/2022/03/enlargement_print-10-600x600.jpg",
          redirectLink: "https://www.photoland.in/custom-print/photo-enlargement/"
        },
        {
          id: "1757749812740",
          title: "Polaroid Prints",
          description: "Add charm to your celebrations with polaroid-style prints. Ideal for weddings, birthday parties, friendship moments, and travel memories, these vintage-style photos bring fun to scrapbooks, décor walls, and gifts. Their retro appeal makes every occasion unforgettable while keeping your memories stylish and timeless.",
          image: "https://www.photoland.in/wp-content/uploads/2023/02/Polaroid-Print-2-510x510.jpg",
          redirectLink: "https://www.photoland.in/custom-print/polaroid-prints/"
        }
      ]
    }
  ],
  occasions: [
    {
      id: "3",
      title: "Birthday Gifts",
      description: "",
      slug: "Birthday-Gifts",
      image: "https://www.photoland.in/wp-content/uploads/2022/04/Birthday-Gifts-500x500.jpg",
      redirectLink: "https://www.photoland.in/birthday-gifts/"
    }
  ],
  advertisements: []
};

      
      setData(fallbackData);
      setError('Unable to load data. Using default structure.');
    } finally {
      setLoading(false);
    }
  };

  const updateData = (newData: StudioData) => {
    try {
      if (!validateData(newData)) {
        throw new Error('Invalid data structure provided');
      }

      const enhancedData = addMissingFields(newData);
      
      // Update React state for immediate UI updates
      setData(enhancedData);
      
      if (isDevelopment) {
        // Development: Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enhancedData));
        console.log('💾 Data saved to localStorage (Development Mode)');
      } else {
        // Production: Log data for manual update
        console.log('\n🚨 PRODUCTION MODE - Manual Update Required');
        console.log('📋 Copy this data to your data.json file:');
        console.log('=== START DATA ===');
        console.log(JSON.stringify(enhancedData, null, 2));
        console.log('=== END DATA ===');
        console.warn(`
📝 To persist changes in production:
1. Copy the JSON data above
2. Update your src/data/data.json file
3. Commit and push changes
4. Redeploy to Netlify

⚠️  Changes are temporary until data.json is updated!
        `);
      }
      
      setError(null);
      
    } catch (error) {
      console.error('Error updating data:', error);
      setError(error instanceof Error ? error.message : 'Failed to update data');
    }
  };

  const refreshData = () => {
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  // Development helper functions
  useEffect(() => {
    if (isDevelopment && typeof window !== 'undefined') {
      // Add helper functions to window object in development
      (window as any).exportStudioData = () => {
        if (data) {
          console.log('📤 Exporting studio data for production...');
          console.log('=== COPY TO data.json ===');
          console.log(JSON.stringify(data, null, 2));
          console.log('=== END DATA ===');
          
          // Also create downloadable file
          const blob = new Blob([JSON.stringify(data, null, 2)], 
                               { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'studio-data-export.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          console.log('📁 Data exported as studio-data-export.json');
        }
      };
      
      console.log('🛠️  Development helpers available:');
      console.log('   - exportStudioData() - Export current data for production');
    }
  }, [data, isDevelopment]);

  return { 
    data, 
    loading, 
    error, 
    updateData, 
    refreshData 
  };
};