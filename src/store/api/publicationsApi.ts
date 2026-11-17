import { Publication } from "@/types/publicationTypes";
import axiosInstance from "./axiosInstance";

export interface PublicationQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface UpdatePublicationPayload {
    file_name?: string;
    file?: File;
}
export interface CreatePublicationPayload {
    pdf: File;
}

function unwrapCertificate(
    data: unknown,
    wrapperKey?: "certificateWithRelation" | "updatedCertificate"
): Publication {
    if (data && typeof data === "object" && !Array.isArray(data)) {
        const record = data as Record<string, unknown>;
        const keys = wrapperKey
            ? [wrapperKey]
            : ["certificateWithRelation", "updatedCertificate"];
        for (const key of keys) {
            const inner = record[key];
            if (inner && typeof inner === "object" && !Array.isArray(inner) && "id" in inner) {
                return inner as Publication;
            }
        }
        if ("id" in record) {
            return record as unknown as Publication;
        }
    }
    return data as Publication;
}

export const fetchAllPublications = async (): Promise<Publication[]> => {
    const response = await axiosInstance.get("/certificate/get-all");
    const data = response.data;
    return Array.isArray(data) ? data : data?.data ?? [];
};

/**
 * GET /certificate/get/:id streams PDF bytes — never call it for JSON metadata.
 * Load the certificate record from GET /certificate/get-all instead.
 */
export const fetchPublicationById = async (id: string | number): Promise<Publication> => {
    const publications = await fetchAllPublications();
    const record = publications.find((item) => String(item.id) === String(id));
    if (!record) {
        throw new Error("Certificate not found");
    }
    return record;
};

export const uploadPublication = async (payload: CreatePublicationPayload): Promise<Publication> => {
    const formData = new FormData();
    formData.append("pdf", payload.pdf);

    const response = await axiosInstance.post("/certificate/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapCertificate(response.data, "certificateWithRelation");
};

export const updatePublication = async (
    id: string | number,
    payload: UpdatePublicationPayload = {}
): Promise<Publication> => {
    if (payload.file) {
        const formData = new FormData();
        formData.append("pdf", payload.file);

        const response = await axiosInstance.put(`/certificate/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return unwrapCertificate(response.data, "updatedCertificate");
    }

    const response = await axiosInstance.put(`/certificate/update/${id}`, payload);
    return unwrapCertificate(response.data, "updatedCertificate");
};

export const deletePublication = async (id: string | number) => {
    const response = await axiosInstance.delete(`/certificate/delete/${id}`);
    return response.data;
};
