import axiosInstance from "@/lib/axios";

export interface SubCategory {
  _id: string;
  name: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  image?: string;
  subCategories?: SubCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  try {
    const response = await axiosInstance.get("/users/product-categories");
    const categoriesData = response.data?.data || response.data || [];
    return Array.isArray(categoriesData) ? categoriesData : [];
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
}
