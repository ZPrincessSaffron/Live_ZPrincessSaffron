import productJar from "@/assets/product1.png";
import giftBox from "@/assets/product2.png";

const preloadedImages = new Set<string>();
const injectedPreloadLinks = new Set<string>();

type ImagePreloadPriority = "high" | "auto" | "low";

type PreloadImageOptions = {
    priority?: ImagePreloadPriority;
};

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

const injectPreloadLink = (resolvedPath: string, priority: ImagePreloadPriority): void => {
    if (typeof document === "undefined" || injectedPreloadLinks.has(resolvedPath)) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = resolvedPath;
    link.setAttribute("fetchpriority", priority);
    document.head.appendChild(link);
    injectedPreloadLinks.add(resolvedPath);
};

export const preloadImage = (imagePath: string, options: PreloadImageOptions = {}): void => {
    if (typeof window === "undefined") return;

    const resolvedPath = resolveProductImage(imagePath);
    if (!resolvedPath || preloadedImages.has(resolvedPath)) return;

    const priority = options.priority ?? "auto";

    injectPreloadLink(resolvedPath, priority);

    preloadedImages.add(resolvedPath);

    const image = new Image();
    image.decoding = priority === "high" ? "sync" : "async";
    image.setAttribute("fetchpriority", priority);
    image.src = resolvedPath;
};

export const preloadImages = (imagePaths: string[], options: PreloadImageOptions = {}): void => {
    imagePaths.forEach((imagePath) => preloadImage(imagePath, options));
};
