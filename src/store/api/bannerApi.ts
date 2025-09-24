import axiosInstance from "./axiosInstance";


export interface BannerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateBannerPayload {
  title: string;
  description?: string;
  status?: string;
}

export interface UpdateBannerPayload {
  title?: string;
  description?: string;
  file?: File;
  status?: string;
}


export const fetchAllBanners = async (params: BannerQueryParams = {}) => {
  const defaultParams: BannerQueryParams = { page: 1, limit: 100, ...params };
  const response = await axiosInstance.get("/banner/get-all", { params: defaultParams });
  return response.data;
};


export const fetchBannerById = async (id: string) => {
  const response = await axiosInstance.get(`/banner/get/${id}`);
  return response.data;
};


export const uploadBanner = async (
  file: File,
  payload: CreateBannerPayload
) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.status) formData.append("status", payload.status);

  const response = await axiosInstance.post("/banner/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


export const updateBanner = async (
  id: string | number,
  payload: UpdateBannerPayload = {}
) => {
  if (payload.file) {
    const formData = new FormData();
    formData.append("image", payload.file);
    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    if (payload.status) formData.append("status", payload.status);

    const response = await axiosInstance.put(`/banner/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } else {
    const response = await axiosInstance.put(`/banner/update/${id}`, payload);
    return response.data;
  }
};


export const deleteBanner = async (id: string) => {
  const response = await axiosInstance.delete(`/banner/delete/${id}`);
  return response.data;
};
