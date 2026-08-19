import axiosInstance from "@/lib/axios";

export interface AddProductsToLivePayload {
  id: string;
  productIds: string[];
}

export interface AddProductsToLiveResponse {
  success?: boolean;
  message?: string;
  data?: any;
}

export async function addProductsToLive(
  liveId: string,
  productIds: string[]
): Promise<AddProductsToLiveResponse> {
  const response = await axiosInstance.post("/lives/products", {
    id: liveId,
    productIds,
  });
  return response.data;
}
