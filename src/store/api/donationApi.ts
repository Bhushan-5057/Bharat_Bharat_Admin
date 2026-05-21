  import axiosInstance from "./axiosInstance";

  export interface Donation {
    id: string;
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    upi_id: string;
    file_name?: string;
    createdAt?: string;
    updatedAt?: string;
    created_by?: number;
    creator?: {
      id: number;
      name: string;
    };
    data:string
  }


  export interface CreateDonationPayload {
    title: string;
    description: string;
    sub_title: string;
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    upi_id: string;
    file?: File;
  }

  export interface UpdateDonationPayload {
    title?: string;
    description?: string;
    sub_title?: string;
    account_holder_name?: string;
    account_number?: string;
    bank_name?: string;
    ifsc_code?: string;
    upi_id?: string;
    file?: File;
  }


  export const fetchAllDonations = async (): Promise<Donation[]> => {
    const response = await axiosInstance.get("/donation_page/get-all");
    return response.data;
  };

  
  export const fetchDonationById = async (id: string): Promise<Donation> => {
    const response = await axiosInstance.get(`/donation_page/get/${id}`);
    return response.data;
  };

  export const createDonation = async (payload: FormData) => {
    const response = await axiosInstance.post("/donation_page/create", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };


export const updateDonation = async (id: string, payload: FormData): Promise<Donation> => {
  const response = await axiosInstance.put(`/donation_page/update/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

  
  export const deleteDonation = async (id: string): Promise<{ id: string }> => {
    const response = await axiosInstance.delete(`/donation_page/delete/${id}`);
    return response.data;
  };
