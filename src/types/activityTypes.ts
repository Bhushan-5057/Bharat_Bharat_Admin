export interface Activity {
    id: string;
    title: string;
    description?: string;
    file_name?: string;
    data?: string;
    status?: string;
    creator?: {
        id: number;
        name: string;
    }
}

export interface CreateActivityPayload {
    title: string;
    description?: string;
    file_name?: File;
}

export interface UpdateActivityPayload {
    id: string;
    title?: string;
    description?: string;
    file_name?: File;
    data?: string;
}
