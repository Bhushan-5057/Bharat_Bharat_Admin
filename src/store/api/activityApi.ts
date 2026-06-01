import {
  Activity,
  CreateActivityPayload,
  UpdateActivityPayload,
} from "@/types/activityTypes";

import axiosInstance from "./axiosInstance";

/* =========================
   FIXED FORM DATA BUILDER
========================= */
const buildFormData = (
  payload: Partial<CreateActivityPayload> & { file?: File }
) => {
  const formData = new FormData();

  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }

    if (value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    formData.append(key, String(value));
  };

  // file
  if (payload.file_name instanceof File) {
    formData.append("file_name", payload.file_name);
  }

  append("title", payload.title);
  append("description", payload.description);
  append("venue", payload.venue);
  append("date", payload.date);

  // 🔥 IMPORTANT FIX: always send time (no skipping)
  append("start_time", payload.start_time);
  append("end_time", payload.end_time);

  return formData;
};

/* =========================
   API CALLS
========================= */

export const fetchAllActivities = async (): Promise<Activity[]> => {
  const response = await axiosInstance.get<Activity[]>("/activities/get-all");
  return response.data;
};

export const fetchActivityById = async (id: string): Promise<Activity> => {
  const response = await axiosInstance.get<Activity>(`/activities/get/${id}`);
  return response.data;
};

export const createActivity = async (
  payload: CreateActivityPayload
): Promise<Activity> => {
  const formData = buildFormData(payload);

  const response = await axiosInstance.post<Activity>(
    "/activities/create",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export const updateActivity = async (
  payload: UpdateActivityPayload
): Promise<Activity> => {
  const formData = buildFormData(payload);

  const response = await axiosInstance.put<Activity>(
    `/activities/update/${payload.id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export const deleteActivity = async (
  id: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/activities/delete/${id}`);
  return response.data;
};
