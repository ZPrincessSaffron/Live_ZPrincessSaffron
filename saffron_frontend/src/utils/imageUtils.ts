import productJar from "@/assets/product1.png";
import giftBox from "@/assets/product2.png";

/**
 * Resolves an image path from the database.
 * If the path is a filename that matches our local assets, it returns the imported asset.
 * If the path is a base64 string or a full URL, it returns it as is.
 */
export const resolveProductImage = (imagePath: string): string => {
    if (!imagePath) return productJar; // Fallback

    // Handle local asset filenames from legacy data
    const legacyMappings: Record<string, string> = {
        "product-saffron-jar.jpg": productJar,
        "product-gift-box.jpg": giftBox,
        "saffron-jar": productJar, // some variants
        "gift-box": giftBox,
    };

    if (legacyMappings[imagePath]) {
        return legacyMappings[imagePath];
    }

    // If it's a base64 string or a absolute URL, return it directly
    if (imagePath.startsWith("data:") || imagePath.startsWith("http")) {
        return imagePath;
    }

    // Default fallback if nothing matches
    return imagePath || productJar;
};
