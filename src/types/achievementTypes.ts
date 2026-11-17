export interface AchievementImage {
  id: number;
  file_name?: string;
  url?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
  data?: string | null;
  is_main?: boolean;
  achievement_id?: number;
}

export interface Creator {
  id: number;
  name: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  address: string | null;
  created_by: number;
  creator?: Creator;
  createdAt: string;
  updatedAt: string;
  images: AchievementImage[];
}

export interface CreateAchievementPayload {
  title: string;
  description: string;
  address?: string;
  file_name?: File[];
  existingImages?: AchievementImage[];
  mainImageIndex?: number;
}

export interface UpdateAchievementPayload {
  title?: string;
  description?: string;
  address?: string;
  file_name?: File[];
  existingImages?: AchievementImage[];
  mainImageIndex?: number;
  images?: Array<{
    achievement_id?: string | number;
    is_main?: boolean;
    data?: File;
  }>;
}

export interface AchievementQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AchievementState {
  items: Achievement[];
  selected: Achievement | null;
  loading: boolean;
  error: string | null;
}
