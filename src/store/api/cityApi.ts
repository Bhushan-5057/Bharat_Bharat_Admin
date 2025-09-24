

import { City, CityImage, CreateCityPayload, UpdateCityPayload } from "@/types/cityTypes";
import axiosInstance from "./axiosInstance";


const buildFormData = (
    payload: CreateCityPayload | UpdateCityPayload & { mainImageIndex?: number }
) => {
    const formData = new FormData();

    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);


    if (payload.file_name && payload.file_name.length > 0) {
        payload.file_name.forEach((file, index) => {
            formData.append("file_name", file);
            formData.append("is_main", index === payload.mainImageIndex ? "true" : "false");
        });
    }
    return formData;
};

export const fetchAllCities = async (): Promise<City[]> => {
    const response = await axiosInstance.get<City[]>("/cities/get-all");
    return response.data;
};


export const fetchCityById = async (id: string): Promise<City> => {
    const response = await axiosInstance.get<City>(`/cities/get/${id}`);
    return response.data;
};


export const createCity = async (
    payload: CreateCityPayload
): Promise<City> => {
    const formData = buildFormData(payload);


    const response = await axiosInstance.post<City>(
        "/cities/create",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return response.data;
};


export const updateCity = async (
    id: string | number,
    payload: UpdateCityPayload & { mainImageIndex?: number; images?: CityImage[] }
) => {
    const formData = new FormData();

    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);


    if (payload.images && payload.images.length > 0) {
        payload.images.forEach((img) => {
            if (img.cities_id) {

                formData.append("existing_images[]", JSON.stringify({
                    id: img.cities_id,
                    is_main: img.is_main,
                }));
            } else if (typeof img.data === "object" && img.data !== null && "name" in img.data && "size" in img.data && "type" in img.data) {

                formData.append("file_name", img.data as File);
                formData.append("is_main", img.is_main ? "true" : "false");
            }
        });
    }

    const response = await axiosInstance.put(`/cities/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};


export const deleteCity = async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
        `/cities/delete/${id}`
    );
    return response.data;
};

export const updateCitiesImage = async (
    id: string | number,
    data: { is_main: boolean }
) => {
    const response = await axiosInstance.put(`/cities/images/update/${id}`, data);
    return response.data;
};

export const fetchCitiesImages = async (id: string | number) => {
    const response = await axiosInstance.get(`/cities/images/get/${id}`);
    return response.data;
};

export const deleteCitiesImage = async (imageId: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete<{ message: string }>(
        `/cities/images/delete/${imageId}`
    );
    return response.data;
};

