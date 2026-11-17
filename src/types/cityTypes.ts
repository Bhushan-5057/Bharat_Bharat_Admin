export interface CityImage {
  id: string;
  url?: string | null;
  file_name?: string;
  data?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
  is_main?: boolean;
  cities_id?: number;
}

export interface CityContact {
  id?: number;
  person_name: string;
  contact_number: string;
  email?: string;
  designation?: string;
}

export interface City {
  id: string;
  state?: string;
  title: string;
  description?: string;
  url?: string;
  status?: string;
  creator?: {
    id: number;
    name: string;
  };
  images?: CityImage[];
  contacts?: CityContact[];
}


export interface CreateCityPayload {
  state?: string;
  title: string;
  description?: string;
  url?: string; 
  mainImageIndex?: number;
  file_name?: File[];
  contacts?: CityContact[];
}


export interface UpdateCityPayload {
  id: string;
  state?: string;
  title?: string;
  description?: string;
  url?: string; 
  mainImageIndex?: number;
  is_main?: boolean;
  file_name?: File[];
  contacts?: CityContact[];
}
