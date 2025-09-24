export interface Service {
  id: string;
  title: string;
  description?: string;
  file_name?: string;   
  data?: string;        
  status?: string;
}


export interface Service {
  id: string;
  title: string;
  description?: string;
  file_name?: string;
  data?: string;
  status?: string;
}

export interface ServiceState {
  services: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
}
