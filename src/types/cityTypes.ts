export interface CityImage {
  id: string;
  file_name?: string;  
  data?: string;
  is_main?: boolean;    
  cities_id?: number;  
}

export interface City {
  id: string;
  title: string;
  description?: string;
  file_name?: string;
  data?: string;
  status?: string;
  creator?: {
    id: number;
    name: string;
  };
  images?: CityImage[];
}


export interface CreateCityPayload {
  title: string;
  description?: string;
  file_name?: File[]; 
  mainImageIndex?: number;
}


export interface UpdateCityPayload {
  id: string;
  title?: string;
  description?: string;
  file_name?: File[]; 
  data?: string;
  mainImageIndex?: number;
  is_main?: boolean;
}
