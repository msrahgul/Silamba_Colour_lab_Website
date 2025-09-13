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
            id: "fallback-1",
            title: "Welcome to Our Studio",
            subtitle: "Professional photography services",
            imageDesktop: "https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
            imageMobile: "https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=768&h=1024&fit=crop",
            active: true
          }
        ],
        categories: [
          {
            id: "fallback-1",
            title: "Photography Services",
            description: "Professional photography for all occasions",
            slug: "services",
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
            subcategories: []
          }
        ],
        occasions: [],
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