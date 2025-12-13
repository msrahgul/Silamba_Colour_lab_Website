import { Banner, Category, SubCategory, Occasion } from "@/data/mockData";

const API_URL = "http://localhost:3000";

export const api = {
    // Banners (Multiple)
    getBanners: async (): Promise<Banner[]> => {
        const res = await fetch(`${API_URL}/banners`);
        if (!res.ok) {
            // Fallback for initial setup if /banners doesn't exist yet, try /banner
            // or just return empty array to prevent crash
            try {
                const legacyRes = await fetch(`${API_URL}/banner`);
                if (legacyRes.ok) {
                    const legacyData = await legacyRes.json();
                    return Array.isArray(legacyData) ? legacyData : [legacyData];
                }
            } catch (e) {
                console.warn("Could not fetch banners", e);
            }
            return [];
        }
        return res.json();
    },

    createBanner: async (banner: Omit<Banner, "id">): Promise<Banner> => {
        const res = await fetch(`${API_URL}/banners`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(banner),
        });
        if (!res.ok) throw new Error("Failed to create banner");
        return res.json();
    },

    updateBanner: async (banner: Banner): Promise<Banner> => {
        const res = await fetch(`${API_URL}/banners/${banner.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(banner),
        });
        if (!res.ok) throw new Error("Failed to update banner");
        return res.json();
    },

    deleteBanner: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/banners/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete banner");
    },

    // Categories
    getCategories: async (): Promise<Category[]> => {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
    },
    createCategory: async (category: Category): Promise<Category> => {
        const res = await fetch(`${API_URL}/categories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
        });
        if (!res.ok) throw new Error("Failed to create category");
        return res.json();
    },
    updateCategory: async (category: Category): Promise<Category> => {
        const res = await fetch(`${API_URL}/categories/${category.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
        });
        if (!res.ok) throw new Error("Failed to update category");
        return res.json();
    },
    deleteCategory: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete category");
    },

    // SubCategories
    getSubCategories: async (): Promise<SubCategory[]> => {
        const res = await fetch(`${API_URL}/subcategories`);
        if (!res.ok) throw new Error("Failed to fetch subcategories");
        return res.json();
    },
    createSubCategory: async (subCategory: SubCategory): Promise<SubCategory> => {
        const res = await fetch(`${API_URL}/subcategories`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subCategory),
        });
        if (!res.ok) throw new Error("Failed to create subcategory");
        return res.json();
    },
    updateSubCategory: async (subCategory: SubCategory): Promise<SubCategory> => {
        const res = await fetch(`${API_URL}/subcategories/${subCategory.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subCategory),
        });
        if (!res.ok) throw new Error("Failed to update subcategory");
        return res.json();
    },
    deleteSubCategory: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/subcategories/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete subcategory");
    },

    // Occasions
    getOccasions: async (): Promise<Occasion[]> => {
        const res = await fetch(`${API_URL}/occasions`);
        if (!res.ok) throw new Error("Failed to fetch occasions");
        return res.json();
    },
    createOccasion: async (occasion: Occasion): Promise<Occasion> => {
        const res = await fetch(`${API_URL}/occasions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(occasion),
        });
        if (!res.ok) throw new Error("Failed to create occasion");
        return res.json();
    },
    updateOccasion: async (occasion: Occasion): Promise<Occasion> => {
        const res = await fetch(`${API_URL}/occasions/${occasion.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(occasion),
        });
        if (!res.ok) throw new Error("Failed to update occasion");
        return res.json();
    },
    deleteOccasion: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/occasions/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete occasion");
    },
};
