import axiosInstance from "./axiosInstance";

export interface ContactDetails {
  id: string | number;
  phone: string;
  email: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
  created_by?: number;
  creator?: {
    id: number;
    name: string;
  };
}

export interface ContactDetailsPayload {
  phone: string;
  email: string;
  address: string;
}

export const fetchAllContactDetails = async (): Promise<ContactDetails[]> => {
  const response = await axiosInstance.get("/contact_details/get-all");
  return response.data;
};

export const fetchContactDetailsById = async (
  id: string
): Promise<ContactDetails> => {
  const response = await axiosInstance.get(`/contact_details/get/${id}`);
  return response.data;
};

export const createContactDetails = async (
  payload: ContactDetailsPayload
) => {
  const response = await axiosInstance.post("/contact_details/create", payload);
  return response.data;
};

export const updateContactDetails = async (
  id: string,
  payload: ContactDetailsPayload
): Promise<ContactDetails> => {
  const response = await axiosInstance.put(
    `/contact_details/update/${id}`,
    payload
  );
  return response.data?.contactDetails || response.data;
};

export const deleteContactDetails = async (
  id: string
): Promise<{ id: string }> => {
  const response = await axiosInstance.delete(`/contact_details/delete/${id}`);
  return response.data;
};
