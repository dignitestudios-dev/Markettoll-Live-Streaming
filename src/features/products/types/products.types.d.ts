interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  rating: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
