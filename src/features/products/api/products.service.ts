import axiosInstance from "@/lib/axios";

export async function getProducts(limit = 6): Promise<ProductsResponse> {
  const { data } = await axiosInstance.get<ProductsResponse>(`https://dummyjson.com/products?limit=${limit}`);
  return data;
}

