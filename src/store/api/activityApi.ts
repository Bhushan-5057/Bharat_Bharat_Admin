

import { Activity, CreateActivityPayload, UpdateActivityPayload } from "@/types/activityTypes";
import axiosInstance from "./axiosInstance";

const buildFormData = (
    payload: Partial<CreateActivityPayload> & { file?: File }
) => {
    const formData = new FormData();
    if (payload.file_name) formData.append("file_name", payload.file_name);
    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    return formData;
};


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


export const deleteActivity = async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
        `/activities/delete/${id}`
    );
    return response.data;
};
