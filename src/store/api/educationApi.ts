import { CreateEducationPayload, EducationQueryParams, UpdateEducationPayload } from "@/types/educationTypes";
import axiosInstance from "./axiosInstance";


export const fetchAllEducations = async (params: EducationQueryParams = {}) => {
  const defaultParams = { page: 1, limit: 100, ...params };
  const response = await axiosInstance.get("/education/get-all", { params: defaultParams });
  return response.data;
};


export const fetchEducationById = async (id: string | number) => {
  const response = await axiosInstance.get(`/education/get/${id}`);
  return response.data;
};

export const createEducation = async (
  payload: CreateEducationPayload & { mainFileIndex?: number }
) => {
  const formData = new FormData();

  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.type) formData.append("type", payload.type);
  if (payload.school_address) formData.append("school_address", payload.school_address);

  if (payload.file_name && payload.file_name.length > 0) {
    payload.file_name.forEach((file, index) => {
      formData.append("file_name", file); 
      
      formData.append("is_main", index === payload.mainImageIndex ? "true" : "false");
    });
  }

  const response = await axiosInstance.post("/education/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const updateEducation = async (id: string | number, payload: UpdateEducationPayload) => {
  const formData = new FormData();

  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.type) formData.append("type", payload.type);
  if (payload.school_address) formData.append("school_address", payload.school_address);

  if (payload.images?.length) {
    payload.images.forEach((img) => {
      if (img.education_id) {
        formData.append(
          "existing_images[]",
          JSON.stringify({ id: img.education_id, is_main: img.is_main })
        );
      } else if (img.data instanceof File) {
        formData.append("file_name", img.data);
        formData.append("is_main", img.is_main ? "true" : "false");
      }
    });
  }

  const response = await axiosInstance.put(`/education/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};


export const deleteEducation = async (id: string | number) => {
  const response = await axiosInstance.delete(`/education/delete/${id}`);
  return response.data;
};

export const fetchEducationImages = async (id: string | number) => {
  const response = await axiosInstance.get(`/education/images/get/${id}`);
  return response.data;
};

export const deleteEducationImage = async (id: string | number) => {
  const response = await axiosInstance.delete(`/education/images/delete/${id}`);
  return response.data;
}

export const updateEducationImage = async (
  id: string | number,
  data: { is_main: boolean }
) => {
  const response = await axiosInstance.put(`/education/images/update/${id}`, data);
  return response.data;
};
