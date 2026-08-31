export interface SelectableProduct {
  id: string;
  _id?: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  pricing?: {
    originalPrice?: number;
    discountedPrice?: number;
    discountAmount?: number;
    discount?: {
      id?: string;
      type?: string;
      value?: number;
      startDate?: string;
      endDate?: string;
      status?: string;
    };
  };
  deliveryType: string;
  rating: number;
  category?: string;
  quantity?: number;
  quantitySold?: number;
}

export interface CreateLiveStreamFormData {
  title: string;
  description: string;
  category: string;
  thumbnail: File | string | null;
  selectedProductIds: string[];
}
