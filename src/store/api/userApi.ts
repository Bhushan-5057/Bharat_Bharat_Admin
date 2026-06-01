import axiosInstance from "./axiosInstance";

interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  department?: string;
}

export const fetchAllUsers = async (params: UserQueryParams = {}) => {
  const defaultParams: UserQueryParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 100,
    ...params,
  };

  const response = await axiosInstance.get("/user/get-all", {
    params: defaultParams,
  });

  return response.data;
};


export const fetchUserById = async (id: string) => {
  const response = await axiosInstance.get(`/user/get/${id}`);
  return response.data;
};

export interface CreateUserPayload {
  email: string;
  name: string;
  password: string;
  role?: "admin" | "super_admin";
}

export const createUser = async (payload: CreateUserPayload) => {
  const response = await axiosInstance.post("/user/create", payload);
  return response.data;
};

export interface UpdateUserPayload {
  id: string;
  name: string;
  password?: string; 
}

export const updateUser = async (payload: UpdateUserPayload) => {
  const { id, ...userData } = payload;
  const response = await axiosInstance.put(`/user/update/${id}`, userData);
  return response.data;
};


export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/user/delete/${id}`);
  return response.data;
};
