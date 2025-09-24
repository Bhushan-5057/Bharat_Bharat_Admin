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


export const fetchAllPublications = async () => {
    const response = await axiosInstance.get("/certificate/get-all",);
    return response.data;
};


export const fetchPublicationById = async (id: string | number) => {
    const response = await axiosInstance.get(`/certificate/get/${id}`, {
        responseType: "arraybuffer",
    });
    const contentDisposition = response.headers["content-disposition"];
    let fileName = "document.pdf";
    if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) fileName = match[1];
    }

    return { pdfData: response.data, fileName };
};


export const uploadPublication = async (payload: CreatePublicationPayload) => {
    const formData = new FormData();
    formData.append("pdf", payload.pdf);
    formData.append("file_name", payload.pdf.name);

    const response = await axiosInstance.post("/certificate/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};



export const updatePublication = async (
    id: string | number,
    payload: UpdatePublicationPayload = {}
) => {
    if (payload.file) {
        const formData = new FormData();
        formData.append("pdf", payload.file);
        formData.append("file_name", payload.file.name);
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const response = await axiosInstance.put(`/certificate/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } else {
        const response = await axiosInstance.put(`/certificate/update/${id}`, payload);
        return response.data;
    }
};




export const deletePublication = async (id: string | number) => {
    const response = await axiosInstance.delete(`/certificate/delete/${id}`);
    return response.data;
};
