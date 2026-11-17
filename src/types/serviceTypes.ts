
export interface Service {
  id: string;
  title: string;
  description?: string;
  file_name?: string;
  url?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
  data?: string | null;
  status?: string;
}

export interface ServiceState {
  services: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
}
