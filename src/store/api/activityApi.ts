import {
  Activity,
  CreateActivityPayload,
  UpdateActivityPayload,
} from "@/types/activityTypes";

import axiosInstance from "./axiosInstance";
import { timeToHHMM } from "@/utils/time";

const appendTextFields = (
  formData: FormData,
  payload: Partial<CreateActivityPayload> & Partial<UpdateActivityPayload>
) => {
  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;

    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }

    formData.append(key, String(value));
  };

  append("title", payload.title);
  append("description", payload.description);
  append("state", payload.state);
  append("venue", payload.venue);
  append("date", payload.date);
  if ("end_date" in payload) {
    formData.append("end_date", payload.end_date ?? "");
  }
  append("start_time", timeToHHMM(payload.start_time) || payload.start_time);
  append("end_time", timeToHHMM(payload.end_time) || payload.end_time);
};

const appendFiles = (
  formData: FormData,
  payload: Partial<CreateActivityPayload> & Partial<UpdateActivityPayload>
) => {
  const files = Array.isArray(payload.file_name)
    ? payload.file_name.filter((file): file is File => file instanceof File)
    : [];

  files.forEach((file, index) => {
    formData.append("file_name", file);
    formData.append(
      "is_main",
      payload.mainImageIndex === undefined
        ? "false"
        : index === payload.mainImageIndex
          ? "true"
          : "false"
    );
  });
};

const unwrapActivity = (data: unknown): Activity => {
  if (data && typeof data === "object" && "data" in data) {
    const inner = (data as { data: unknown }).data;
    if (
      inner &&
      typeof inner === "object" &&
      !Array.isArray(inner) &&
      "id" in inner
    ) {
      return normalizeActivityTimes(inner as Activity);
    }
  }
  return normalizeActivityTimes(data as Activity);
};

const normalizeActivityTimes = (activity: Activity): Activity => ({
  ...activity,
  start_time: timeToHHMM(activity.start_time) || activity.start_time,
  end_time: timeToHHMM(activity.end_time) || activity.end_time,
});

export const fetchAllActivities = async (): Promise<Activity[]> => {
  const response = await axiosInstance.get("/activities/get-all");
  const data = response.data as unknown;

  if (Array.isArray(data)) return (data as Activity[]).map(normalizeActivityTimes);
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: Activity[] }).data.map(normalizeActivityTimes);
  }
  return [];
};

export const fetchActivityById = async (id: string): Promise<Activity> => {
  const response = await axiosInstance.get(`/activities/get/${id}`);
  return unwrapActivity(response.data);
};

export const createActivity = async (
  payload: CreateActivityPayload
): Promise<Activity> => {
  const formData = new FormData();
  appendTextFields(formData, payload);
  appendFiles(formData, {
    ...payload,
    mainImageIndex: payload.mainImageIndex ?? 0,
  });

  const response = await axiosInstance.post("/activities/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return unwrapActivity(response.data);
};

export const updateActivity = async (
  payload: UpdateActivityPayload
): Promise<Activity> => {
  const formData = new FormData();
  appendTextFields(formData, payload);
  appendFiles(formData, payload);

  const response = await axiosInstance.put(
    `/activities/update/${payload.id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return unwrapActivity(response.data);
};

export const deleteActivity = async (
  id: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/activities/delete/${id}`);
  return response.data;
};

export const updateActivityImage = async (
  id: string | number,
  data: { is_main: boolean }
) => {
  const response = await axiosInstance.put(
    `/activities/images/update/${id}`,
    data
  );
  return response.data;
};

export const deleteActivityImage = async (id: string | number) => {
  const response = await axiosInstance.delete(
    `/activities/images/delete/${id}`
  );
  return response.data;
};
