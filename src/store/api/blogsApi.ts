import axios from "axios";
import { Blog, CreateBlogPayload, UpdateBlogPayload } from "@/types/blogTypes";
import axiosInstance from "./axiosInstance";

type BlogRecord = Blog & { _id?: string | number };

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

const unwrapBlog = (data: unknown): Blog => {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const inner = record.data ?? record.blog;
    if (
      inner &&
      typeof inner === "object" &&
      !Array.isArray(inner) &&
      ("id" in inner || "slug" in inner || "title" in inner)
    ) {
      return inner as Blog;
    }
  }
  return data as Blog;
};

const unwrapBlogList = (data: unknown): Blog[] => {
  if (Array.isArray(data)) return data as Blog[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as Blog[];
    if (Array.isArray(record.blogs)) return record.blogs as Blog[];
  }
  return [];
};

const uniqueKeys = (...values: unknown[]): string[] => {
  const keys: string[] = [];
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    const key = String(value);
    if (!keys.includes(key)) keys.push(key);
  }
  return keys;
};

export const matchesBlogKey = (blog: BlogRecord, key: string): boolean =>
  uniqueKeys(blog.id, blog.slug, blog._id).includes(key);

const isNotFound = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 404;

const getBlogRecord = async (key: string): Promise<Blog> => {
  const response = await axiosInstance.get(`/blogs/get/${encodeURIComponent(key)}`);
  return unwrapBlog(response.data);
};

export const fetchAllBlogs = async (): Promise<Blog[]> => {
  const response = await axiosInstance.get("/blogs/get-all");
  return unwrapBlogList(response.data);
};

const findBlogInList = async (key: string): Promise<Blog | undefined> => {
  const blogs = await fetchAllBlogs();
  return blogs.find((blog) => matchesBlogKey(blog, key));
};

export const fetchBlogById = async (
  id: string,
  cached?: Blog | null
): Promise<Blog> => {
  const fromCache =
    cached && matchesBlogKey(cached, id) ? (cached as BlogRecord) : null;
  const keys = uniqueKeys(fromCache?.slug, id, fromCache?.id, fromCache?._id);

  let lastError: unknown;
  for (const key of keys) {
    try {
      return await getBlogRecord(key);
    } catch (error) {
      if (!isNotFound(error)) throw error;
      lastError = error;
    }
  }

  const fromList = fromCache ?? (await findBlogInList(id));
  if (!fromList) {
    throw lastError ?? new Error("Blog not found");
  }

  const retryKeys = uniqueKeys(
    fromList.slug,
    fromList.id,
    (fromList as BlogRecord)._id
  ).filter((key) => !keys.includes(key));

  for (const key of retryKeys) {
    try {
      return await getBlogRecord(key);
    } catch (error) {
      if (!isNotFound(error)) throw error;
      lastError = error;
    }
  }

  return fromList;
};

export const createBlog = async (payload: CreateBlogPayload): Promise<Blog> => {
  const formData = buildFormData(payload);
  const response = await axiosInstance.post("/blogs/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapBlog(response.data);
};

export const updateBlog = async (payload: UpdateBlogPayload): Promise<Blog> => {
  const formData = buildFormData(payload);
  const response = await axiosInstance.put(`/blogs/update/${payload.id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapBlog(response.data);
};

export const deleteBlog = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(`/blogs/delete/${id}`);
  return response.data;
};
