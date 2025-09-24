import axiosInstance from "./axiosInstance";

export interface OfficeBearerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateOfficeBearerPayload {
  title: string;
  designation: string;
  quotes?: string;
  gmail?: string;
  facebook?: string;
  twitter?: string;
  file_name?: File; 
}

export interface UpdateOfficeBearerPayload {
  title?: string;
  designation?: string;
  quotes?: string;
  gmail?: string;
  facebook?: string;
  twitter?: string;
  file_name?: File;
}


export const fetchAllOfficeBearers = async (
  params: OfficeBearerQueryParams = {}
) => {
  const defaultParams: OfficeBearerQueryParams = { page: 1, limit: 100, ...params };
  const response = await axiosInstance.get("/office_bearer/get-all", {
    params: defaultParams,
  });
  return response.data;
};


export const fetchOfficeBearerById = async (id: string | number) => {
  const response = await axiosInstance.get(`/office_bearer/get/${id}`);
  return response.data;
};

export const createOfficeBearer = async (payload: CreateOfficeBearerPayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("designation", payload.designation);
  if (payload.quotes) formData.append("quotes", payload.quotes);
  if (payload.gmail) formData.append("gmail", payload.gmail);
  if (payload.facebook) formData.append("facebook", payload.facebook);
  if (payload.twitter) formData.append("twitter", payload.twitter);
  if (payload.file_name) formData.append("file_name", payload.file_name);

  const response = await axiosInstance.post("/office_bearer/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateOfficeBearer = async (
  id: string | number,
  payload: UpdateOfficeBearerPayload
) => {
  if (payload.file_name) {
    const formData = new FormData();
    if (payload.title) formData.append("title", payload.title);
    if (payload.designation) formData.append("designation", payload.designation);
    if (payload.quotes) formData.append("quotes", payload.quotes);
    if (payload.gmail) formData.append("gmail", payload.gmail);
    if (payload.facebook) formData.append("facebook", payload.facebook);
    if (payload.twitter) formData.append("twitter", payload.twitter);
    formData.append("file_name", payload.file_name);

    const response = await axiosInstance.put(
      `/office_bearer/update/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } else {
    const response = await axiosInstance.put(`/office_bearer/update/${id}`, payload);
    return response.data;
  }
};


export const deleteOfficeBearer = async (id: string | number) => {
  const response = await axiosInstance.delete(`/office_bearer/delete/${id}`);
  return response.data;
};
