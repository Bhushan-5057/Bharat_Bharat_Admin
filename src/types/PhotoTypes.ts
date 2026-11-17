export interface Photo {
  id: string;
  title: string;
  description?: string;
  status: "active" | "inactive";
  data?: string | null;
  file_name?: string;
  url?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
}
