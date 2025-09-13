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
          // Remove any invalid fields from subcategories
          const { headerImage, ...validSubcategory } = sub;
          return validSubcategory;
        }) || []
      }));
    }

    return data as StudioData;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have data in localStorage first
      const storedData = localStorage.getItem(STORAGE_KEY);
      
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          
          if (validateData(parsedData)) {
            const enhancedData = addMissingFields(parsedData);
            setData(enhancedData);
            return;
          } else {
            console.warn('Invalid data format in localStorage, loading from file');
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (parseError) {
          console.error('Error parsing stored data:', parseError);
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // Load from data.json
      try {
        const response = await fetch('/src/data/data.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        
        if (!validateData(jsonData)) {
          throw new Error('Invalid data format in data.json');
        }

        const enhancedData = addMissingFields(jsonData);
        setData(enhancedData);
        
        // Save enhanced data to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enhancedData));
        
      } catch (fetchError) {
        console.error('Error loading data.json:', fetchError);
        
        // Fallback to default data structure
        const fallbackData: StudioData = {
          banners: [],
          categories: [],
          occasions: [],
          advertisements: []
        };
        
        setData(fallbackData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackData));
        setError('Unable to load data. Using default structure.');
      }

    } catch (error) {
      console.error('Error in loadData:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
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
      
      // Immediately update the React state for real-time updates
      setData(enhancedData);
      
      // Save to localStorage for persistence
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enhancedData));
      
      setError(null);
      
      // Dispatch a custom event to notify other components of data changes
      window.dispatchEvent(new CustomEvent('studioDataUpdated', { 
        detail: enhancedData 
      }));
      
    } catch (error) {
      console.error('Error updating data:', error);
      setError(error instanceof Error ? error.message : 'Failed to update data');
    }
  };

  const refreshData = () => {
    localStorage.removeItem(STORAGE_KEY);
    loadData();
  };

  // Listen for data updates from other instances (e.g., multiple tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          if (validateData(newData)) {
            setData(addMissingFields(newData));
          }
        } catch (error) {
          console.error('Error handling storage change:', error);
        }
      }
    };

    const handleDataUpdate = (event: CustomEvent) => {
      // Handle custom data update events
      const newData = event.detail;
      if (validateData(newData)) {
        setData(addMissingFields(newData));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('studioDataUpdated', handleDataUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('studioDataUpdated', handleDataUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  return { 
    data, 
    loading, 
    error, 
    updateData, 
    refreshData 
  };
};