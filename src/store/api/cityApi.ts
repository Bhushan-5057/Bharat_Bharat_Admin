
import { City, CityImage, CreateCityPayload, UpdateCityPayload } from "@/types/cityTypes";
import axiosInstance from "./axiosInstance";


const appendContacts = (
    formData: FormData,
    contacts: CreateCityPayload["contacts"] | UpdateCityPayload["contacts"]
) => {
    if (!Array.isArray(contacts) || contacts.length === 0) return;
    formData.append("contacts", JSON.stringify(contacts));
};

const buildFormData = (
    payload: (CreateCityPayload | UpdateCityPayload) & { mainImageIndex?: number }
) => {
    const formData = new FormData();

    if (payload.state) formData.append("state", payload.state);
    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);


    if (payload.file_name && payload.file_name.length > 0) {
        payload.file_name.forEach((file, index) => {
            formData.append("file_name", file);
            formData.append("is_main", index === payload.mainImageIndex ? "true" : "false");
        });
    }

    appendContacts(formData, payload.contacts);

    return formData;
};

const isCityRecord = (value: unknown): value is City =>
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("id" in value || "title" in value);

const nestedCity = (record: Record<string, unknown>): unknown =>
    record.citiyWithRelation ?? record.city ?? record.data;

export const unwrapCity = (data: unknown): City => {
    let city: City | undefined;
    if (data && typeof data === "object" && !Array.isArray(data)) {
        const record = data as Record<string, unknown>;
        const inner = nestedCity(record);
        if (isCityRecord(inner)) city = inner;
        else if (isCityRecord(data)) city = data;
    }
    if (!city) city = data as City;
    return {
        ...city,
        contacts: Array.isArray(city.contacts) ? city.contacts : [],
    };
};

const unwrapCityList = (data: unknown): City[] => {
    if (Array.isArray(data)) return data as City[];
    if (data && typeof data === "object") {
        const record = data as Record<string, unknown>;
        if (Array.isArray(record.data)) return record.data as City[];
        if (Array.isArray(record.cities)) return record.cities as City[];
    }
    return [];
};

export const fetchAllCities = async (): Promise<City[]> => {
    const response = await axiosInstance.get("/cities/get-all");
    return unwrapCityList(response.data);
};


export const fetchCityById = async (id: string): Promise<City> => {
    const response = await axiosInstance.get<City>(`/cities/get/${id}`);
    return unwrapCity(response.data);
};


export const createCity = async (
    payload: CreateCityPayload
): Promise<City> => {
    const formData = buildFormData(payload);


    const response = await axiosInstance.post(
        "/cities/create",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return unwrapCity(response.data);
};


export const updateCity = async (
    id: string | number,
    payload: UpdateCityPayload & { mainImageIndex?: number; images?: CityImage[] }
) => {
    const formData = new FormData();

    if (payload.state) formData.append("state", payload.state);
    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);

    if (payload.contacts !== undefined) {
        appendContacts(formData, payload.contacts);
    }


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

    return unwrapCity(response.data);
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
