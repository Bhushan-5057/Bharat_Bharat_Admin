export interface EducationImage {
   id: number;
  file_name?: string;  
  data?: string;      
  is_main?:boolean; 
}

export interface Creator {
  id: number | string;
  name: string;
}

export interface CreateEducationPayload {
  title: string;
  description: string;
  type: "education" | "school";
  school_address?: string;
  file_name?: File[]; 
  existingImages?: EducationImage[]; 
  mainImageIndex?:number
}

export interface UpdateEducationPayload {
  title?: string;
  description?: string;
  type?: "education" | "school";
  school_address?: string;
  file_name?: File[];
  existingImages?: EducationImage[];
   mainImageIndex?:number
}

export interface Education {
  id: number | string;
  type: "school" | "education";
  title: string;
  description: string;
  school_address?: string | null;
  images?: EducationImage[];
  created_by?: number | string;
  creator?: Creator;
  createdAt?: string;
  updatedAt?: string;
}

export interface EducationQueryParams {
  page?: number;
  limit?: number;
  type?: "school" | "education";
  search?: string;
}

export interface CreateEducationPayload {
  title: string;
  description: string;
  type: "education" | "school";
  school_address?: string;
  file_name?: File[]; 
  mainImageIndex?:number;
}

export interface UpdateEducationPayload {
  title?: string;
  description?: string;
  type?: "education" | "school";
  school_address?: string;
  file_name?: File[]; 
  mainImageIndex?: number;
  images?: Array<{
    education_id?: string | number;
    is_main?: boolean;
    data?: File;
  }>;
}

export interface EducationState {
  items: Education[];
  selected: Education | null;
  loading: boolean;
  error: string | null;
}