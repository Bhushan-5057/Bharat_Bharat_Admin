// src/types/blogTypes.ts
export interface Blog {
  id: number | string;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  content: string;
  tags: string;
  category: string;
  created_by: number;
  creator: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  file_name?: string;
  url?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
  data?: string | null;
  file?: string;
}

export interface CreateBlogPayload {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  content: string;
  tags: string;
  category: string;
  file_name?: string;  
  file?: File;          
}

export interface UpdateBlogPayload {
  id: string | number;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  content: string;
  tags: string;
  category: string;
  file?: File; 
}


export interface BlogState {
  items: Blog[];
  selected: Blog | null;
  loading: boolean;
  error: string | null;
}
