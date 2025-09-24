import axiosInstance from "./axiosInstance";

export interface VideoQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateVideoPayload {
  title: string;
  description?: string;
  status?: string;
}

export const fetchAllVideos = async (params: VideoQueryParams = {}) => {
  const defaultParams: VideoQueryParams = { page: 1, limit: 100, ...params };
  const response = await axiosInstance.get("/gallery_video/get-all", {
    params: defaultParams,
  });
  return response.data;
};


export const fetchVideoById = async (id: string | number) => {
  const response = await axiosInstance.get(`/gallery_video/get/${id}`);
  return response.data;
};


export const uploadVideo = async (payload: {id?:number, youtube_url: string; description: string }) => {
  const response = await axiosInstance.post("/gallery_video/add", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};



export const deleteVideo = async (id: string | number) => {
  const response = await axiosInstance.delete(`/gallery_video/delete/${id}`);
  return response.data;
};

export const updateVideoApi = async (
  id: string | number,
  payload: { youtube_url: string; description: string }
) => {
  const response = await axiosInstance.put(`/gallery_video/update/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
