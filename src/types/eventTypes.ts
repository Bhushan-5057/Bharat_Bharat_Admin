export interface Event {
    event_data: unknown;
    data: unknown;
    id: string;
    title: string;
    description?: string;
    venue?: string;
    file_name?: string;
    event_date: string;
    start_time: string;
    end_time: string;
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
    venue: string;
    event_date: string;
    start_time: string;
    end_time: string;
    file_name?: File;
}

export interface UpdateEventePayload {
    id: string;
    title?: string;
    description?: string;
    venue?: string;
    event_date: string;
    start_time: string;
    end_time: string;
    file_name?: File;
    data?: string;
}
