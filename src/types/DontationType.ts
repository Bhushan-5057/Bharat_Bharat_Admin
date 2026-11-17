export interface Donation {
  id: string;
  title: string;
  description: string;
  sub_title?: string;
  account_holder_name: string;
  account_number: string;
  bank_name: string;
  ifsc_code: string;
  created_by?: number;
 creator?: {
    id: number;
    name: string;
  };
  file_name?: string;
  url?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
  data?: string | null;
}

export interface DonationTableOneProps {
  donations: Donation[];
}
