
import axiosInstance from "./axiosInstance";


export interface Service {
  id: string;
  title: string;
  description?: string;
  venue?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  file_name?: string;
  data?: string;
  status?: string;
}

export interface CreateServicePayload {
  title: string;
  description?: string;
  venue?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  file_name?: File;
}

export interface UpdateServicePayload {
  id: string;
  title?: string;
  description?: string;
  venue?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  file_name?: File;
  data?: string;
}


const buildFormData = (
  payload: Partial<CreateServicePayload> & { file?: File }
) => {
  const formData = new FormData();
  if (payload.file_name) formData.append("file_name", payload.file_name);
  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.status) formData.append("status", payload.status);
  return formData;
};




export const fetchAllServices = async (): Promise<Service[]> => {
  const response = await axiosInstance.get<Service[]>("/service/get-all");
  return response.data;
};


export const fetchServiceById = async (id: string): Promise<Service> => {
  const response = await axiosInstance.get<Service>(`/service/get/${id}`);
  return response.data;
};


export const createService = async (
  payload: CreateServicePayload
): Promise<Service> => {
  const formData = buildFormData(payload);
  const response = await axiosInstance.post<Service>(
    "/service/create",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};


export const updateService = async (
  payload: UpdateServicePayload
): Promise<Service> => {
  const formData = buildFormData(payload);
  const response = await axiosInstance.put<Service>(
    `/service/update/${payload.id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};


export const deleteService = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(
    `/service/delete/${id}`
  );
  return response.data;
};
