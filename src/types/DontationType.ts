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
  data?: string;
}

export interface DonationTableOneProps {
  donations: Donation[];
}
