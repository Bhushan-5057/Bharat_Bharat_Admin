export interface ActivityImage {
  id: number;
  file_name?: string;
  url?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
  data?: string | null;
  is_main?: boolean;
  activity_id?: number;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  url?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
  data?: string | null;
  state?: string;
  venue?: string;
  date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  file_name?: string;
  images?: ActivityImage[];
  main_image?: ActivityImage | null;
  creator?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}


export interface CreateActivityPayload {
  title: string;
  description?: string;
  state?: string;
  venue: string;
  date: string;
  end_date?: string;
  start_time: string;
  end_time: string;
  file_name?: File[];
  mainImageIndex?: number;
}


export interface UpdateActivityPayload {
  id: string;
  title?: string;
  description?: string;
  state?: string;
  venue?: string;
  date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  file_name?: File[];
  mainImageIndex?: number;
  url?: string;
}
