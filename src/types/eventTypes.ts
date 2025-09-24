export interface Event {
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
    date?: string;
    time?: string;
    createdAt?: string;
}

export interface CreateEventPayload {
    title: string;
    description?: string;
    file_name?: File;
}

export interface UpdateEventePayload {
    id: string;
    title?: string;
    description?: string;
    file_name?: File;
    data?: string;
}
