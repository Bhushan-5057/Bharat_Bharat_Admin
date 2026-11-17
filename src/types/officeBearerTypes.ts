export interface OfficeBearer {
  id: number | string;
  title: string;
  designation: string;
  gmail?: string;
  facebook?: string;
  twitter?: string;
  quotes?: string;
  data?: string | null;
  file_name?: string;
  url?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
  creator?: { name?: string };
  createdAt?: string;
  updatedAt?: string;
}
export interface OfficeBearerState {
  items: OfficeBearer[];
  selected: OfficeBearer | null;
  loading: boolean;
  error: string | null;
}
