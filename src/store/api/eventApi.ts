import {
  CreateEventPayload,
  Event,
  UpdateEventePayload,
} from "@/types/eventTypes";

import axiosInstance from "./axiosInstance";
import { timeToHHMM } from "@/utils/time";

const appendFiles = (
  formData: FormData,
  payload: Partial<CreateEventPayload> & Partial<UpdateEventePayload>
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

const buildFormData = (
  payload: Partial<CreateEventPayload> & Partial<UpdateEventePayload>
) => {
  const formData = new FormData();

  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.state !== undefined) formData.append("state", payload.state);
  if (payload.venue !== undefined) formData.append("venue", payload.venue);
  if (payload.event_date !== undefined) formData.append("event_date", payload.event_date);
  if ("end_date" in payload) formData.append("end_date", payload.end_date ?? "");
  if (payload.start_time !== undefined) formData.append("start_time", timeToHHMM(payload.start_time));
  if (payload.end_time !== undefined) formData.append("end_time", timeToHHMM(payload.end_time));

  appendFiles(formData, payload);

  return formData;
};

const normalizeEventTimes = (event: Event): Event => ({
  ...event,
  start_time: timeToHHMM(event.start_time) || event.start_time,
  end_time: timeToHHMM(event.end_time) || event.end_time,
});

const unwrapEvent = (data: unknown): Event => {
  if (data && typeof data === "object" && "data" in data) {
    const inner = (data as { data: unknown }).data;
    if (
      inner &&
      typeof inner === "object" &&
      !Array.isArray(inner) &&
      "id" in inner
    ) {
      return normalizeEventTimes(inner as Event);
    }
  }
  return normalizeEventTimes(data as Event);
};

export const fetchAllEvents = async (): Promise<Event[]> => {
  const response = await axiosInstance.get("/events/get-all");

  const body = response.data as
    | Event[]
    | {
        data?: Event[] | { events?: Event[]; integrations?: Event[] };
        events?: Event[];
        integrations?: Event[];
      };

  if (Array.isArray(body)) return body.map(normalizeEventTimes);

  const payload = body.data ?? body;

  if (Array.isArray(payload)) return payload.map(normalizeEventTimes);

  return (payload.events || payload.integrations || []).map(normalizeEventTimes);
};

export const fetchEventById = async (id: string): Promise<Event> => {
  const response = await axiosInstance.get(`/events/get/${id}`);
  return unwrapEvent(response.data);
};

export const createEvent = async (
  payload: CreateEventPayload
): Promise<Event> => {
  const formData = buildFormData({
    ...payload,
    mainImageIndex: payload.mainImageIndex ?? 0,
  });

  const response = await axiosInstance.post("/events/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return unwrapEvent(response.data);
};

export const updateEvent = async (
  payload: UpdateEventePayload
): Promise<Event> => {
  const formData = buildFormData(payload);

  const response = await axiosInstance.put(
    `/events/update/${payload.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return unwrapEvent(response.data);
};

export const deleteEvent = async (
  id: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(`/events/delete/${id}`);
  return response.data;
};

export const updateEventImage = async (
  id: string | number,
  data: { is_main: boolean }
) => {
  const response = await axiosInstance.put(`/events/images/update/${id}`, data);
  return response.data;
};

export const deleteEventImage = async (id: string | number) => {
  const response = await axiosInstance.delete(`/events/images/delete/${id}`);
  return response.data;
};
