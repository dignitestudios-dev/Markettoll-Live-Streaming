export interface LiveProduct {
  id: string;
  image: string;
  discount: string;
  title?: string;
  price?: string;
  originalPrice?: string;
}

export interface LiveStream {
  id: string;
  streamerName: string;
  streamerAvatar: string;
  category: string;
  title: string;
  viewerCount: string;
  thumbnail: string;
  products: LiveProduct[];
  isLive: boolean;
  duration?: string;
}
