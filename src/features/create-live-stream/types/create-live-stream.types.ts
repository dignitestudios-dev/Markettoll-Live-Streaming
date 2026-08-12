export interface SelectableProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  deliveryType: string;
  rating: number;
  category?: string;
}

export interface CreateLiveStreamFormData {
  title: string;
  description: string;
  category: string;
  thumbnail: File | string | null;
  selectedProductIds: string[];
}
