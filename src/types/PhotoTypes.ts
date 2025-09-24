export interface Photo {
  id: string;
  title: string;
  description?: string;
  status: "active" | "inactive";
  data?: string; 
  file_name?: string;
}
