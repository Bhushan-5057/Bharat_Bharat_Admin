import {
  CreateEventPayload,
  Event,
  UpdateEventePayload,
} from "@/types/eventTypes";

import axiosInstance from "./axiosInstance";

const buildFormData = (
  payload: Partial<CreateEventPayload> & { file?: File; id?: string }
) => {
  const formData = new FormData();

  // Always append required fields (even empty string is valid)
  if (payload.title !== undefined)       formData.append("title",       payload.title);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.venue !== undefined)       formData.append("venue",       payload.venue);
  if (payload.event_date !== undefined)  formData.append("event_date",  payload.event_date);
  if (payload.start_time !== undefined)  formData.append("start_time",  payload.start_time);
  if (payload.end_time !== undefined)    formData.append("end_time",    payload.end_time);

  // File is optional – only append when a new file is selected
  if (payload.file_name instanceof File) formData.append("file_name", payload.file_name);
  if (payload.file instanceof File)      formData.append("file",      payload.file);

  return formData;
};

export const fetchAllEvents = async (): Promise<Event[]> => {
  const response = await axiosInstance.get(
    "/integration/get-all"
  );

  return Array.isArray(response.data)
    ? response.data
    : response.data.data || [];
};

export const fetchEventById = async (
  id: string
): Promise<Event> => {
  const response = await axiosInstance.get(
    `/integration/get/${id}`
  );

  return response.data.data || response.data;
};

export const createEvent = async (
  payload: CreateEventPayload
): Promise<Event> => {
  const formData = buildFormData(payload);

  const response = await axiosInstance.post(
    "/integration/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data || response.data;
};

export const updateEvent = async (
  payload: UpdateEventePayload
): Promise<Event> => {
  const formData = buildFormData(payload);

  const response = await axiosInstance.put(
    `/integration/update/${payload.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data || response.data;
};

export const deleteEvent = async (
  id: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(
    `/integration/delete/${id}`
  );

  return response.data;
};