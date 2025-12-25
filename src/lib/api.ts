
import { Banner, Category, SubCategory, Occasion, Offer } from "@/data/mockData";

const API_URL = "http://localhost:3000";

export const api = {
    // Banners
    getBanners: async (): Promise<Banner[]> => {
        const response = await fetch(`${API_URL}/banners`);
        return response.json();
    },

    createBanner: async (banner: Omit<Banner, "id">): Promise<Banner> => {
        const response = await fetch(`${API_URL}/banners`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(banner),
        });
        return response.json();
    },

    updateBanner: async (banner: Banner): Promise<Banner> => {
        const response = await fetch(`${API_URL}/banners/${banner.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(banner),
        });
        return response.json();
    },

    deleteBanner: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/banners/${id}`, {
            method: "DELETE",
        });
    },

    // Categories
    getCategories: async (): Promise<Category[]> => {
        const response = await fetch(`${API_URL}/categories`);
        return response.json();
    },
    createCategory: async (category: Category): Promise<Category> => {
        const response = await fetch(`${API_URL}/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
        });
        return response.json();
    },
    updateCategory: async (category: Category): Promise<Category> => {
        const response = await fetch(`${API_URL}/categories/${category.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
        });
        return response.json();
    },
    deleteCategory: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
    },

    // SubCategories
    getSubCategories: async (): Promise<SubCategory[]> => {
        const response = await fetch(`${API_URL}/subcategories`);
        return response.json();
    },
    createSubCategory: async (subCategory: SubCategory): Promise<SubCategory> => {
        const response = await fetch(`${API_URL}/subcategories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subCategory),
        });
        return response.json();
    },
    updateSubCategory: async (subCategory: SubCategory): Promise<SubCategory> => {
        const response = await fetch(`${API_URL}/subcategories/${subCategory.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subCategory),
        });
        return response.json();
    },
    deleteSubCategory: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/subcategories/${id}`, { method: "DELETE" });
    },

    // Occasions
    getOccasions: async (): Promise<Occasion[]> => {
        const response = await fetch(`${API_URL}/occasions`);
        return response.json();
    },
    createOccasion: async (occasion: Occasion): Promise<Occasion> => {
        const response = await fetch(`${API_URL}/occasions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(occasion),
        });
        return response.json();
    },
    updateOccasion: async (occasion: Occasion): Promise<Occasion> => {
        const response = await fetch(`${API_URL}/occasions/${occasion.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(occasion),
        });
        return response.json();
    },
    deleteOccasion: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/occasions/${id}`, { method: "DELETE" });
    },

    // Offers
    getOffers: async (): Promise<Offer[]> => {
        const response = await fetch(`${API_URL}/offers`);
        return response.json();
    },
    createOffer: async (offer: Offer): Promise<Offer> => {
        const response = await fetch(`${API_URL}/offers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(offer),
        });
        return response.json();
    },
    updateOffer: async (offer: Offer): Promise<Offer> => {
        const response = await fetch(`${API_URL}/offers/${offer.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(offer),
        });
        return response.json();
    },
    deleteOffer: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/offers/${id}`, { method: "DELETE" });
    },
};
