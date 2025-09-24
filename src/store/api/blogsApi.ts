import { Blog, CreateBlogPayload, UpdateBlogPayload } from "@/types/blogTypes";
import axiosInstance from "./axiosInstance";


const buildFormData = (payload: Partial<CreateBlogPayload>) => {
  const formData = new FormData();
  if (payload.file) formData.append("file_name", payload.file); 
  if (payload.title) formData.append("title", payload.title);
  if (payload.meta_title) formData.append("meta_title", payload.meta_title);
  if (payload.meta_description) formData.append("meta_description", payload.meta_description);
  if (payload.slug) formData.append("slug", payload.slug);
  if (payload.tags) formData.append("tags", payload.tags);
  if (payload.category) formData.append("category", payload.category);
  if (payload.content) formData.append("content", payload.content);
  return formData;
};

export const fetchAllBlogs = async (): Promise<Blog[]> => {
  const response = await axiosInstance.get<Blog[]>("/blogs/get-all");
  return response.data;
};

export const fetchBlogById = async (id: string): Promise<Blog> => {
  const response = await axiosInstance.get<Blog>(`/blogs/get/${id}`);
  return response.data;
};

export const createBlog = async (payload: CreateBlogPayload): Promise<Blog> => {
  const formData = buildFormData(payload);
  const response = await axiosInstance.post<Blog>("/blogs/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBlog = async (payload: UpdateBlogPayload): Promise<Blog> => {
  const formData = buildFormData(payload);
  const response = await axiosInstance.put<Blog>(`/blogs/update/${payload.id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


export const deleteBlog = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(`/blogs/delete/${id}`);
  return response.data;
};
