
// src/lib/cloudinary.ts
const CLOUD_NAME = "dwnitcfgr"; // Replace with your Cloudinary Cloud Name
const UPLOAD_PRESET = "ml_default"; // Replace with your Unsigned Upload Preset

export const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary Error:", errorData);
        throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await response.json();

    // Returns the secure URL with automatic format and quality optimization
    return data.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
};
