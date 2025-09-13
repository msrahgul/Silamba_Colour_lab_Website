import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { 
  Save, 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff, 
  X, 
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { 
  StudioData, 
  Category, 
  Subcategory, 
  Banner, 
  Occasion, 
  Advertisement 
} from '../../types';

interface MessageState {
  type: 'success' | 'error';
  message: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, updateData } = useData();
  
  // State management
  const [activeTab, setActiveTab] = useState<'categories' | 'banners' | 'occasions' | 'advertisements'>('categories');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{ categoryId: string; subcategoryId: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    title: '',
    description: '',
    slug: '',
    image: '',
    headerImage: ''
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    title: '',
    description: '',
    image: '',
    redirectLink: ''
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    imageDesktop: '',
    imageMobile: '',
    active: true
  });

  const [occasionForm, setOccasionForm] = useState({
    title: '',
    description: '',
    slug: '',
    image: '',
    redirectLink: ''
  });

  const [advertisementForm, setAdvertisementForm] = useState({
    title: '',
    description: '',
    image: '',
    redirectLink: '',
    active: true,
    position: 'home-middle' as Advertisement['position']
  });

  // Authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('cms-authenticated');
    if (!isAuthenticated) {
      navigate('/cms/login');
    }
  }, [navigate]);

  // Auto-hide messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Utility functions
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, message: text });
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const saveData = async (newData: StudioData) => {
    setSaving(true);
    try {
      updateData(newData);
      showMessage('success', 'Data updated successfully!');
      resetForms();
    } catch (error) {
      showMessage('error', 'Failed to update data.');
    } finally {
      setSaving(false);
    }
  };

  const resetForms = () => {
    setCategoryForm({ title: '', description: '', slug: '', image: '', headerImage: '' });
    setSubcategoryForm({ title: '', description: '', image: '', redirectLink: '' });
    setBannerForm({ title: '', subtitle: '', imageDesktop: '', imageMobile: '', active: true });
    setOccasionForm({ title: '', description: '', slug: '', image: '', redirectLink: '' });
    setAdvertisementForm({ title: '', description: '', image: '', redirectLink: '', active: true, position: 'home-middle' });
    setEditingItem(null);
    setEditingSubcategory(null);
    setShowAddForm(false);
  };

  // Category operations
  const handleAddCategory = async () => {
    if (!data || !categoryForm.title.trim()) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      title: categoryForm.title.trim(),
      description: categoryForm.description.trim(),
      slug: categoryForm.slug.trim() || generateSlug(categoryForm.title),
      image: categoryForm.image.trim(),
      headerImage: categoryForm.headerImage.trim() || categoryForm.image.trim(),
      subcategories: []
    };

    const newData = {
      ...data,
      categories: [...data.categories, newCategory]
    };

    await saveData(newData);
  };

  const handleUpdateCategory = async (categoryId: string) => {
    if (!data || !categoryForm.title.trim()) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const newData = {
      ...data,
      categories: data.categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              title: categoryForm.title.trim(),
              description: categoryForm.description.trim(),
              slug: categoryForm.slug.trim() || generateSlug(categoryForm.title),
              image: categoryForm.image.trim(),
              headerImage: categoryForm.headerImage.trim() || categoryForm.image.trim()
            }
          : category
      )
    };

    await saveData(newData);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!data) return;
    
    const newData = {
      ...data,
      categories: data.categories.filter(category => category.id !== categoryId)
    };

    await saveData(newData);
  };

  const startEditCategory = (category: Category) => {
    setCategoryForm({
      title: category.title,
      description: category.description,
      slug: category.slug,
      image: category.image,
      headerImage: category.headerImage || category.image
    });
    setSubcategoryForm({ title: '', description: '', image: '', redirectLink: '' });
    setEditingItem(category.id);
    setEditingSubcategory(null);
    setShowAddForm(true);
  };

  // Subcategory operations - FIXED
  const handleAddSubcategory = async (categoryId: string) => {
    if (!data || !subcategoryForm.title.trim() || !subcategoryForm.redirectLink.trim()) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const newSubcategory: Subcategory = {
      id: Date.now().toString(),
      title: subcategoryForm.title.trim(),
      description: subcategoryForm.description.trim(),
      image: subcategoryForm.image.trim(),
      redirectLink: subcategoryForm.redirectLink.trim()
    };

    // FIXED: Properly preserve category data and only add to subcategories
    const newData = {
      ...data,
      categories: data.categories.map(category =>
        category.id === categoryId
          ? { 
              ...category, // Keep all existing category data intact
              subcategories: [...category.subcategories, newSubcategory] // Only add to subcategories
            }
          : category // Leave other categories unchanged
      )
    };

    await saveData(newData);
  };

  const handleUpdateSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (!data || !subcategoryForm.title.trim() || !subcategoryForm.redirectLink.trim()) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const newData = {
      ...data,
      categories: data.categories.map(category =>
        category.id === categoryId
          ? {
              ...category, // Keep all existing category data intact
              subcategories: category.subcategories.map(sub =>
                sub.id === subcategoryId
                  ? {
                      ...sub,
                      title: subcategoryForm.title.trim(),
                      description: subcategoryForm.description.trim(),
                      image: subcategoryForm.image.trim(),
                      redirectLink: subcategoryForm.redirectLink.trim()
                    }
                  : sub
              )
            }
          : category
      )
    };

    await saveData(newData);
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (!data) return;
    
    const newData = {
      ...data,
      categories: data.categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              subcategories: category.subcategories.filter(sub => sub.id !== subcategoryId)
            }
          : category
      )
    };

    await saveData(newData);
  };

  // FIXED: Proper subcategory form state management
  const startAddSubcategory = (categoryId: string) => {
    // Reset forms properly
    setSubcategoryForm({ title: '', description: '', image: '', redirectLink: '' });
    setCategoryForm({ title: '', description: '', slug: '', image: '', headerImage: '' });
    
    // Set editing state for subcategory addition
    setEditingItem(categoryId); // Store parent category ID
    setEditingSubcategory(null); // Clear subcategory edit state
    setShowAddForm(true);
  };

  const startEditSubcategory = (categoryId: string, subcategory: Subcategory) => {
    setSubcategoryForm({
      title: subcategory.title,
      description: subcategory.description,
      image: subcategory.image,
      redirectLink: subcategory.redirectLink
    });
    setCategoryForm({ title: '', description: '', slug: '', image: '', headerImage: '' });
    
    setEditingSubcategory({ categoryId, subcategoryId: subcategory.id });
    setEditingItem(null); // Clear category edit state
    setShowAddForm(true);
  };

  // Banner operations
  const handleAddBanner = async () => {
    if (!data || !bannerForm.title.trim() || !bannerForm.imageDesktop.trim()) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const newBanner: Banner = {
      id: Date.now().toString(),
      title: bannerForm.title.trim(),
      subtitle: bannerForm.subtitle.trim(),
      imageDesktop: bannerForm.imageDesktop.trim(),
      imageMobile: bannerForm.imageMobile.trim() || bannerForm.imageDesktop.trim(),
      active: bannerForm.active
    };

    const newData = {
      ...data,
      banners: [...data.banners, newBanner]
    };

    await saveData(newData);
  };

  const handleUpdateBanner = async (bannerId: string) => {
    if (!data || !bannerForm.title.trim() || !bannerForm.imageDesktop.trim()) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const newData = {
      ...data,
      banners: data.banners.map(banner =>
        banner.id === bannerId
          ? {
              ...banner,
              title: bannerForm.title.trim(),
              subtitle: bannerForm.subtitle.trim(),
              imageDesktop: bannerForm.imageDesktop.trim(),
              imageMobile: bannerForm.imageMobile.trim() || bannerForm.imageDesktop.trim(),
              active: bannerForm.active
            }
          : banner
      )
    };

    await saveData(newData);
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!data) return;
    
    const newData = {
      ...data,
      banners: data.banners.filter(banner => banner.id !== bannerId)
    };

    await saveData(newData);
  };

  const toggleBannerStatus = async (bannerId: string) => {
    if (!data) return;
    
    const newData = {
      ...data,
      banners: data.banners.map(banner =>
        banner.id === bannerId
          ? { ...banner, active: !banner.active }
          : banner
      )
    };

    await saveData(newData);
  };

  const startEditBanner = (banner: Banner) => {
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle,
      imageDesktop: banner.imageDesktop,
      imageMobile: banner.imageMobile,
      active: banner.active
    });
    setEditingItem(banner.id);
    setShowAddForm(true);
  };

  // Occasion operations
  const handleAddOccasion = async () => {
    if (!data || !occasionForm.title.trim() || !occasionForm.redirectLink.trim()) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const newOccasion: Occasion = {
      id: Date.now().toString(),
      title: occasionForm.title.trim(),
      description: occasionForm.description.trim(),
      slug: occasionForm.slug.trim() || generateSlug(occasionForm.title),
      image: occasionForm.image.trim(),
      redirectLink: occasionForm.redirectLink.trim()
    };

    const newData = {
      ...data,
      occasions: [...data.occasions, newOccasion]
    };

    await saveData(newData);
  };

  const handleUpdateOccasion = async (occasionId: string) => {
    if (!data || !occasionForm.title.trim() || !occasionForm.redirectLink.trim()) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const newData = {
      ...data,
      occasions: data.occasions.map(occasion =>
        occasion.id === occasionId
          ? {
              ...occasion,
              title: occasionForm.title.trim(),
              description: occasionForm.description.trim(),
              slug: occasionForm.slug.trim() || generateSlug(occasionForm.title),
              image: occasionForm.image.trim(),
              redirectLink: occasionForm.redirectLink.trim()
            }
          : occasion
      )
    };

    await saveData(newData);
  };

  const handleDeleteOccasion = async (occasionId: string) => {
    if (!data) return;
    
    const newData = {
      ...data,
      occasions: data.occasions.filter(occasion => occasion.id !== occasionId)
    };

    await saveData(newData);
  };

  const startEditOccasion = (occasion: Occasion) => {
    setOccasionForm({
      title: occasion.title,
      description: occasion.description,
      slug: occasion.slug,
      image: occasion.image,
      redirectLink: occasion.redirectLink
    });
    setEditingItem(occasion.id);
    setShowAddForm(true);
  };

  // Advertisement operations
  const handleAddAdvertisement = async () => {
    if (!data || !advertisementForm.title.trim()) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const newAdvertisement: Advertisement = {
      id: Date.now().toString(),
      title: advertisementForm.title.trim(),
      description: advertisementForm.description.trim(),
      image: advertisementForm.image.trim(),
      redirectLink: advertisementForm.redirectLink.trim(),
      active: advertisementForm.active,
      position: advertisementForm.position
    };

    const newData = {
      ...data,
      advertisements: [...data.advertisements, newAdvertisement]
    };

    await saveData(newData);
  };

  const handleUpdateAdvertisement = async (adId: string) => {
    if (!data || !advertisementForm.title.trim()) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const newData = {
      ...data,
      advertisements: data.advertisements.map(ad =>
        ad.id === adId
          ? {
              ...ad,
              title: advertisementForm.title.trim(),
              description: advertisementForm.description.trim(),
              image: advertisementForm.image.trim(),
              redirectLink: advertisementForm.redirectLink.trim(),
              active: advertisementForm.active,
              position: advertisementForm.position
            }
          : ad
      )
    };

    await saveData(newData);
  };

  const handleDeleteAdvertisement = async (adId: string) => {
    if (!data) return;
    
    const newData = {
      ...data,
      advertisements: data.advertisements.filter(ad => ad.id !== adId)
    };

    await saveData(newData);
  };

  const toggleAdvertisementStatus = async (adId: string) => {
    if (!data) return;
    
    const newData = {
      ...data,
      advertisements: data.advertisements.map(ad =>
        ad.id === adId
          ? { ...ad, active: !ad.active }
          : ad
      )
    };

    await saveData(newData);
  };

  const startEditAdvertisement = (advertisement: Advertisement) => {
    setAdvertisementForm({
      title: advertisement.title,
      description: advertisement.description,
      image: advertisement.image,
      redirectLink: advertisement.redirectLink,
      active: advertisement.active,
      position: advertisement.position
    });
    setEditingItem(advertisement.id);
    setShowAddForm(true);
  };

  // Form submission handler
  const handleFormSubmit = async () => {
    if (activeTab === 'categories') {
      if (editingSubcategory) {
        await handleUpdateSubcategory(editingSubcategory.categoryId, editingSubcategory.subcategoryId);
      } else if (editingItem && !categoryForm.title && subcategoryForm.title) {
        // Adding new subcategory
        await handleAddSubcategory(editingItem);
      } else if (editingItem && categoryForm.title) {
        // Updating existing category
        await handleUpdateCategory(editingItem);
      } else if (categoryForm.title) {
        // Adding new category
        await handleAddCategory();
      }
    } else if (activeTab === 'banners') {
      if (editingItem) {
        await handleUpdateBanner(editingItem);
      } else {
        await handleAddBanner();
      }
    } else if (activeTab === 'occasions') {
      if (editingItem) {
        await handleUpdateOccasion(editingItem);
      } else {
        await handleAddOccasion();
      }
    } else if (activeTab === 'advertisements') {
      if (editingItem) {
        await handleUpdateAdvertisement(editingItem);
      } else {
        await handleAddAdvertisement();
      }
    }
  };

  const getButtonText = () => {
    if (saving) return 'Saving...';
    
    if (activeTab === 'categories') {
      if (editingSubcategory) return 'Update Subcategory';
      if (editingItem && !categoryForm.title) return 'Add Subcategory';
      if (editingItem) return 'Update Category';
      return 'Add Category';
    }
    
    if (editingItem) return `Update ${activeTab.slice(0, -1)}`;
    return `Add ${activeTab.slice(0, -1)}`;
  };

  const logout = () => {
    localStorage.removeItem('cms-authenticated');
    navigate('/cms/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Data</h1>
          <p className="text-gray-600 mb-4">There was an error loading the dashboard data.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Site
              </button>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <p className="text-sm font-medium">{message.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {['categories', 'banners', 'occasions', 'advertisements'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as any);
                  resetForms();
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 capitalize">
                    {activeTab} Management
                  </h2>
                  <button
                    onClick={() => {
                      resetForms();
                      setShowAddForm(true);
                    }}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {activeTab.slice(0, -1)}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your {activeTab} content and settings
                </p>
              </div>

              <div className="p-6">
                {/* Categories */}
                {activeTab === 'categories' && (
                  <div className="space-y-6">
                    {data.categories.map((category) => (
                      <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <img
                                src={category.image}
                                alt={category.title}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                }}
                              />
                              <div>
                                <h3 className="font-medium text-gray-900">{category.title}</h3>
                                <p className="text-sm text-gray-500">{category.description}</p>
                                <p className="text-xs text-gray-400">/{category.slug}</p>
                              </div>
                            </div>
                            
                            {/* Subcategories */}
                            {category.subcategories.length > 0 && (
                              <div className="mt-4 pl-4 border-l-2 border-gray-100">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Subcategories ({category.subcategories.length})
                                </h4>
                                <div className="space-y-2">
                                  {category.subcategories.map((sub) => (
                                    <div key={sub.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                      <div className="flex items-center space-x-2">
                                        <img
                                          src={sub.image}
                                          alt={sub.title}
                                          className="w-8 h-8 object-cover rounded"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/32x32?text=No+Image';
                                          }}
                                        />
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">{sub.title}</p>
                                          <p className="text-xs text-gray-500">{sub.description}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <button
                                          onClick={() => startEditSubcategory(category.id, sub)}
                                          className="p-1 text-gray-400 hover:text-gray-600"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteSubcategory(category.id, sub.id)}
                                          className="p-1 text-gray-400 hover:text-red-600"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => startAddSubcategory(category.id)}
                              className="p-2 text-gray-400 hover:text-blue-600"
                              title="Add Subcategory"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startEditCategory(category)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="Edit Category"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-2 text-gray-400 hover:text-red-600"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Banners */}
                {activeTab === 'banners' && (
                  <div className="space-y-4">
                    {data.banners.map((banner) => (
                      <div key={banner.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={banner.imageDesktop}
                              alt={banner.title}
                              className="w-20 h-12 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/80x48?text=No+Image';
                              }}
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{banner.title}</h3>
                              <p className="text-sm text-gray-500">{banner.subtitle}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                banner.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {banner.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleBannerStatus(banner.id)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              {banner.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => startEditBanner(banner)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="p-2 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Occasions */}
                {activeTab === 'occasions' && (
                  <div className="space-y-4">
                    {data.occasions.map((occasion) => (
                      <div key={occasion.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={occasion.image}
                              alt={occasion.title}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{occasion.title}</h3>
                              <p className="text-sm text-gray-500">{occasion.description}</p>
                              <p className="text-xs text-gray-400">/{occasion.slug}</p>
                              {occasion.redirectLink && (
                                <p className="text-xs text-blue-500 hover:text-blue-600">
                                  <ExternalLink className="w-3 h-3 inline mr-1" />
                                  {occasion.redirectLink}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => startEditOccasion(occasion)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOccasion(occasion.id)}
                              className="p-2 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Advertisements */}
                {activeTab === 'advertisements' && (
                  <div className="space-y-4">
                    {data.advertisements.map((ad) => (
                      <div key={ad.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={ad.image}
                              alt={ad.title}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{ad.title}</h3>
                              <p className="text-sm text-gray-500">{ad.description}</p>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  ad.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {ad.active ? 'Active' : 'Inactive'}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {ad.position}
                                </span>
                              </div>
                              {ad.redirectLink && (
                                <p className="text-xs text-blue-500 hover:text-blue-600 mt-1">
                                  <ExternalLink className="w-3 h-3 inline mr-1" />
                                  {ad.redirectLink}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleAdvertisementStatus(ad.id)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              {ad.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => startEditAdvertisement(ad)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdvertisement(ad.id)}
                              className="p-2 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Form */}
          <div className="lg:col-span-1">
            {showAddForm && (
              <div className="bg-white rounded-lg shadow sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {getButtonText().replace('Saving...', editingItem || editingSubcategory ? 'Edit' : 'Add')}
                    </h3>
                    <button
                      onClick={resetForms}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Category Form */}
                  {activeTab === 'categories' && !editingSubcategory && categoryForm.title !== '' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category Title *
                        </label>
                        <input
                          type="text"
                          value={categoryForm.title}
                          onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter category title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slug
                        </label>
                        <input
                          type="text"
                          value={categoryForm.slug}
                          onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Auto-generated from title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category Image URL *
                        </label>
                        <input
                          type="url"
                          value={categoryForm.image}
                          onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://example.com/image.jpg"
                        />
                        {categoryForm.image && (
                          <img
                            src={categoryForm.image}
                            alt="Preview"
                            className="mt-2 w-full h-32 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Header Image URL
                        </label>
                        <input
                          type="url"
                          value={categoryForm.headerImage}
                          onChange={(e) => setCategoryForm({ ...categoryForm, headerImage: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://example.com/header.jpg (optional)"
                        />
                        <p className="mt-1 text-xs text-gray-500">Used for category page header. Falls back to category image if not provided.</p>
                      </div>
                    </div>
                  )}

                  {/* Subcategory Form */}
                  {activeTab === 'categories' && (editingSubcategory || (editingItem && !categoryForm.title)) && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subcategory Title *
                        </label>
                        <input
                          type="text"
                          value={subcategoryForm.title}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter subcategory title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={subcategoryForm.description}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={subcategoryForm.image}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, image: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://example.com/image.jpg"
                        />
                        {subcategoryForm.image && (
                          <img
                            src={subcategoryForm.image}
                            alt="Preview"
                            className="mt-2 w-full h-32 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Redirect Link *
                        </label>
                        <input
                          type="url"
                          value={subcategoryForm.redirectLink}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, redirectLink: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://example.com/service"
                        />
                      </div>
                    </div>
                  )}

                  {/* Banner Form */}
                  {activeTab === 'banners' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Banner Title *
                        </label>
                        <input
                          type="text"
                          value={bannerForm.title}
                          onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter banner title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={bannerForm.subtitle}
                          onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter banner subtitle"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Desktop Image URL *
                        </label>
                        <input
                          type="url"
                          value={bannerForm.imageDesktop}
                          onChange={(e) => setBannerForm({ ...bannerForm, imageDesktop: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://example.com/banner-desktop.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Image URL
                        </label>
                        <input
                          type="url"
                          value={bannerForm.imageMobile}
                          onChange={(e) => setBannerForm({ ...bannerForm, imageMobile: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://example.com/banner-mobile.jpg (optional)"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="bannerActive"
                          checked={bannerForm.active}
                          onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="bannerActive" className="ml-2 block text-sm text-gray-900">
                          Active
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Occasion Form */}
                  {activeTab === 'occasions' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Occasion Title *
                        </label>
                        <input
                          type="text"
                          value={occasionForm.title}
                          onChange={(e) => setOccasionForm({ ...occasionForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter occasion title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={occasionForm.description}
                          onChange={(e) => setOccasionForm({ ...occasionForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slug
                        </label>
                        <input
                          type="text"
                          value={occasionForm.slug}
                          onChange={(e) => setOccasionForm({ ...occasionForm, slug: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Auto-generated from title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={occasionForm.image}
                          onChange={(e) => setOccasionForm({ ...occasionForm, image: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://example.com/image.jpg"
                        />
                        {occasionForm.image && (
                          <img
                            src={occasionForm.image}
                            alt="Preview"
                            className="mt-2 w-full h-32 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Redirect Link *
                        </label>
                        <input
                          type="url"
                          value={occasionForm.redirectLink}
                          onChange={(e) => setOccasionForm({ ...occasionForm, redirectLink: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://example.com/occasion"
                        />
                      </div>
                    </div>
                  )}

                  {/* Advertisement Form */}
                  {activeTab === 'advertisements' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Advertisement Title *
                        </label>
                        <input
                          type="text"
                          value={advertisementForm.title}
                          onChange={(e) => setAdvertisementForm({ ...advertisementForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter advertisement title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={advertisementForm.description}
                          onChange={(e) => setAdvertisementForm({ ...advertisementForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter description"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={advertisementForm.image}
                          onChange={(e) => setAdvertisementForm({ ...advertisementForm, image: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://example.com/ad-image.jpg"
                        />
                        {advertisementForm.image && (
                          <img
                            src={advertisementForm.image}
                            alt="Preview"
                            className="mt-2 w-full h-32 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Redirect Link
                        </label>
                        <input
                          type="url"
                          value={advertisementForm.redirectLink}
                          onChange={(e) => setAdvertisementForm({ ...advertisementForm, redirectLink: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="https://example.com/offer (optional)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        <select
                          value={advertisementForm.position}
                          onChange={(e) => setAdvertisementForm({ ...advertisementForm, position: e.target.value as Advertisement['position'] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="home-top">Home Top</option>
                          <option value="home-middle">Home Middle</option>
                          <option value="home-bottom">Home Bottom</option>
                          <option value="category-top">Category Top</option>
                          <option value="category-bottom">Category Bottom</option>
                          <option value="floating">Floating</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="adActive"
                          checked={advertisementForm.active}
                          onChange={(e) => setAdvertisementForm({ ...advertisementForm, active: e.target.checked })}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="adActive" className="ml-2 block text-sm text-gray-900">
                          Active
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button
                      onClick={resetForms}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFormSubmit}
                      disabled={saving}
                      className="btn-primary flex items-center"
                    >
                      {saving && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      )}
                      <Save className="w-4 h-4 mr-2" />
                      {getButtonText()}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;