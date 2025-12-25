// src/lib/imagekit.ts
const IMAGEKIT_PUBLIC_KEY = "public_zkTRmiekrxcarOJdbkNoM9qwQzE=";
const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/silamba";

export const uploadToImageKit = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", IMAGEKIT_PUBLIC_KEY);

    // CRITICAL: This allows the upload without a backend signature.
    // It MUST match the name of the preset you enabled in your dashboard.
    formData.append("upload_preset", "default");

    const response = await fetch(`https://upload.imagekit.io/api/v1/files/upload`, {
        method: "POST",
        body: formData,
        // Note: Do NOT add manual headers like 'Content-Type'. 
        // The browser handles this automatically for FormData.
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("ImageKit Error Detail:", errorData);
        throw new Error(errorData.message || "Upload failed");
    }

    const data = await response.json();

    // Appends optimization: f-auto (WebP/AVIF) and q-80 (Compression)
    return `${data.url}?tr=f-auto,q-80`;
};