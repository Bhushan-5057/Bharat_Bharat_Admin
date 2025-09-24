import axiosInstance from "./axiosInstance";

export interface PhotoQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreatePhotoPayload {
  title: string;
  description?: string;
  status?: string;
}

export interface UpdatePhotoPayload {
  title?: string;
  description?: string;
  file?: File;
  status?: string;
}

export interface Photo {
  id: number;
  file_name: string;
  data?: string;
  created_by: number;
  creator: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
  initialPhoto?:{
    id: number;
    file_name: string;
    data?: string;
    created_by: number;
    creator: {
      id: number;
      name: string;
    };
    createdAt?: string;
    updatedAt?: string;
  };
}

export const fetchAllPhotos = async (params: PhotoQueryParams = {}) => {
  const defaultParams: PhotoQueryParams = { page: 1, limit: 100, ...params };
  const response = await axiosInstance.get("/gallery_image/get-all", {
    params: defaultParams,
  });
  return response.data;
};


export const fetchPhotoById = async (id: string | number) => {
  const response = await axiosInstance.get(`/gallery_image/get/${id}`);
  return response.data;
};

export const uploadPhoto = async (file: File, payload?: CreatePhotoPayload) => {
  const formData = new FormData();
  formData.append("file_name", file);

  if (payload?.title) formData.append("title", payload.title);
  if (payload?.description) formData.append("description", payload.description);
  if (payload?.status) formData.append("status", payload.status);

  const response = await axiosInstance.post("/gallery_image/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};



export const updatePhoto = async (
  id: string | number,
  payload: UpdatePhotoPayload = {}
) => {
  if (payload.file) {
    const formData = new FormData();
    formData.append("file_name", payload.file);
    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    if (payload.status) formData.append("status", payload.status);

    const response = await axiosInstance.put(`/gallery_image/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } else {
    const response = await axiosInstance.put(`/gallery_image/update/${id}`, payload);
    return response.data;
  }
};




export const deletePhoto = async (id: string | number) => {
  const response = await axiosInstance.delete(`/gallery_image/delete/${id}`);
  return response.data;
};
