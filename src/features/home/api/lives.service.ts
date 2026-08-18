import axiosInstance from "@/lib/axios";

export interface APILiveHost {
  _id: string;
  name?: string;
  avatar?: string;
}

export interface APILiveItem {
  _id: string;
  host?: APILiveHost;
  title: string;
  description?: string;
  category?: string;
  thumbnail?: string;
  products?: any[];
  coHosts?: any[];
  status?: string;
  hmsRoomId?: string;
  viewerCount?: number;
  createdAt?: string;
}

/**
 * Helper to extract the primary display image URL from a product object
 */
export function extractProductImageUrl(p: any): string {
  if (!p) return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80";

  // 1. Direct image or thumbnail property string
  if (typeof p.image === "string" && p.image) return p.image;
  if (typeof p.thumbnail === "string" && p.thumbnail) return p.thumbnail;

  // 2. Images array from API payload
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


    // Extract attachments array from API response
    const attachments =
      response.data?.data?.attachments ||
      response.data?.attachments ||
      (Array.isArray(response.data?.data) ? response.data.data : []);

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

    if (singleUrl) return singleUrl;
  } catch (error) {
    console.warn("Multipart thumbnail upload API notice:", error);
  }
  return "";
}

/**
 * Resize and compress Image File to keep payload lightweight
 */
export function compressImageFile(file: File, maxWidth = 640, quality = 0.7): Promise<string> {
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

export async function fetchLiveStreamsAPI(): Promise<APILiveItem[]> {
  try {
    const response = await axiosInstance.get("/lives");

    if (response.data?.success) {
      return response?.data?.data?.lives;
    }
    return [];
  } catch (error) {
    console.warn("Failed to fetch /lives API, using fallback:", error);
    return [];
  }
}

