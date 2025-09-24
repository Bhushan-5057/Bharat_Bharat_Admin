export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerState {
  banners: Banner[];
  banner: Banner | null;
  loading: boolean;
  error: string | null;
}