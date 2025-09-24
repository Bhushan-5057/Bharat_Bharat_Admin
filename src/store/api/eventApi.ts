
import { CreateEventPayload, Event, UpdateEventePayload } from "@/types/eventTypes";
import axiosInstance from "./axiosInstance";

const buildFormData = (
    payload: Partial<CreateEventPayload> & { file?: File }
) => {
    const formData = new FormData();
    if (payload.file_name) formData.append("file_name", payload.file_name);
    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    return formData;
};


export const fetchAllEvents = async (): Promise<Event[]> => {
    const response = await axiosInstance.get<Event[]>("/integration/get-all");
    return response.data;
};


export const fetchEventById = async (id: string): Promise<Event> => {
    const response = await axiosInstance.get<Event>(`/integration/get/${id}`);
    return response.data;
};


export const createEvent = async (
    payload: CreateEventPayload
): Promise<Event> => {
    const formData = buildFormData(payload);
    const response = await axiosInstance.post<Event>(
        "/integration/create",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return response.data;
};


export const updateEvent = async (
    payload: UpdateEventePayload
): Promise<Event> => {
    const formData = buildFormData(payload);
    const response = await axiosInstance.put<Event>(
        `/integration/update/${payload.id}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return response.data;
};


export const deleteEvent = async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
        `/integration/delete/${id}`
    );
    return response.data;
};
