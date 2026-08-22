import axiosInstance from "@/lib/axios";

export interface APILiveHost {
  _id?: string;
  id?: string;
  name?: string;
  avatar?: string;
  [key: string]: any;
}

export interface APILiveCategory {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  [key: string]: any;
}

export interface APILiveItem {
  _id?: string;
  id?: string;
  host?: APILiveHost | string;
  title: string;
  description?: string;
  category?: APILiveCategory | string;
  thumbnail?: string;
  products?: any[];
  coHosts?: any[];
  status?: string;
  hmsRoomId?: string;
  viewerCount?: number;
  createdAt?: string;
  [key: string]: any;
}

/**
 * Helper to extract the primary display image URL from a product object
 */
export function extractProductImageUrl(rawP: any): string {
  if (!rawP) return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80";

  const p = rawP.product || rawP;

  // 1. Direct image or thumbnail property string
  if (typeof p.image === "string" && p.image) return p.image;
  if (typeof p.thumbnail === "string" && p.thumbnail) return p.thumbnail;

  // 2. displayImage object or string
  if (typeof p.displayImage === "string" && p.displayImage) return p.displayImage;
  if (p.displayImage && typeof p.displayImage.url === "string" && p.displayImage.url) {
    return p.displayImage.url;
  }

  // 3. Images array from API payload
  if (Array.isArray(p.images) && p.images.length > 0) {
    const displayImg = p.images.find((img: any) => img && (img.displayImage === true || img.isDisplay === true));
    if (displayImg && typeof displayImg.url === "string" && displayImg.url) {
      return displayImg.url;
    }
    const firstImg = p.images[0];
    if (firstImg && typeof firstImg.url === "string" && firstImg.url) {
      return firstImg.url;
    }
    if (typeof firstImg === "string" && firstImg) {
      return firstImg;
    }
  }

  return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80";
}

/**
 * Upload thumbnail image via Multipart FormData to backend API
 */
export async function uploadThumbnailFile(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("attachments", file);

    const response = await axiosInstance.post("/users/upload-chat-attachments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Handle array response: data: ["https://markettollbucket.s3.amazonaws.com/..."]
    if (Array.isArray(response.data?.data) && response.data.data.length > 0) {
      const firstItem = response.data.data[0];
      if (typeof firstItem === "string" && firstItem) return firstItem;
      if (firstItem && typeof firstItem.url === "string" && firstItem.url) return firstItem.url;
      if (firstItem && typeof firstItem.path === "string" && firstItem.path) return firstItem.path;
      if (firstItem && typeof firstItem.location === "string" && firstItem.location) return firstItem.location;
    }

    const attachments =
      response.data?.data?.attachments ||
      response.data?.attachments;

    if (Array.isArray(attachments) && attachments.length > 0) {
      const firstItem = attachments[0];
      if (typeof firstItem === "string" && firstItem) return firstItem;
      if (firstItem && typeof firstItem.url === "string" && firstItem.url) return firstItem.url;
      if (firstItem && typeof firstItem.path === "string" && firstItem.path) return firstItem.path;
      if (firstItem && typeof firstItem.location === "string" && firstItem.location) return firstItem.location;
    }

    const singleUrl =
      response.data?.data?.url ||
      response.data?.url ||
      response.data?.data?.thumbnail ||
      response.data?.thumbnail;

    if (singleUrl && typeof singleUrl === "string") return singleUrl;
  } catch (error) {
    console.error("Multipart thumbnail upload API notice:", error);
  }
  return "";
}

/**
 * Resize and compress Image File while preserving high sharpness and clarity (Full HD 1080p)
 */
export function compressImageFile(file: File, maxWidth = 1920, quality = 0.92): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } else {
        resolve("");
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("");
    };
    img.src = url;
  });
}

export async function fetchLiveStreamsAPI(category?: string): Promise<APILiveItem[]> {
  try {
    const params: Record<string, any> = {};
    if (category && category !== "All" && category.trim() !== "") {
      params.category = category;
    }

    const response = await axiosInstance.get("/lives", { params });

    if (response.data?.success) {
      const data = response.data?.data;
      if (Array.isArray(data?.lives)) return data.lives;
      if (Array.isArray(data)) return data;
      return [];
    }
    return [];
  } catch (error) {
    console.warn("Failed to fetch /lives API, using fallback:", error);
    return [];
  }
}

