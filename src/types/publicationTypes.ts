export interface Creator {
  id: number;
  name: string;
}

export interface SelectedPublication {
  id: number;
  file_name: string;
  url?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
  data?: string | null;
  created_by: number;
  createdAt: string;
  updatedAt?: string;
  creator: Creator;
}

export interface Publication {
    id: number;
    file_name: string;
    url?: string | null;
    cloudinary_url?: string | null;
    cloudinary_public_id?: string | null;
    cloudinary_resource_type?: "image" | "video" | "raw" | null;
    data?: string | null;
    created_by: number;
    createdAt: string;
    creator: {
        id: number;
        name: string;
    };
    updatedAt?: string;
}

export interface PublicationState {
    publications: Publication[];
    selectedPublication: Publication | null;
    loading: boolean;
    error: string | null;
    fileName?: string;
}