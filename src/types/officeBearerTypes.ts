export interface OfficeBearer {
  id: number | string;
  title: string;
  designation: string;
  gmail?: string;
  facebook?: string;
  twitter?: string;
  quotes?: string;
  data?: string;        
  file_name?: string;   
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
