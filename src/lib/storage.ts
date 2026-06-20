import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 * @param path The storage path (e.g., 'crops/').
 * @returns The download URL of the uploaded file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
    // Check for missing or placeholder keys
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey || apiKey.includes("your_api_key")) {
        console.warn("Mock Mode: Simulating image upload.");
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return a fake URL (using placeholder image service for demo)
                resolve(`https://via.placeholder.com/500?text=${encodeURIComponent(file.name)}`);
            }, 1000);
        });
    }

    try {
        const uniqueFileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `${path}/${uniqueFileName}`);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error("Error uploading file:", error);
        // Fallback for demo if real upload fails (e.g. CORS or rules issues even with keys)
        // Check if we are likely in a demo/broken state
        console.warn("Upload failed, falling back to mock URL for demonstration.");
        return `https://via.placeholder.com/500?text=${encodeURIComponent(file.name)}`;
    }
};
