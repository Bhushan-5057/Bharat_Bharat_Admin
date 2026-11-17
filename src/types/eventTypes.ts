export interface EventImage {
    id: number;
    file_name?: string;
    url?: string | null;
    cloudinary_url?: string | null;
    cloudinary_public_id?: string | null;
    cloudinary_resource_type?: "image" | "video" | "raw" | null;
    data?: string | null;
    is_main?: boolean;
    event_id?: number;
}

export interface Event {
    event_data: unknown;
    data: unknown;
    id: string;
    title: string;
    description?: string;
    state?: string;
    venue?: string;
    file_name?: string;
    url?: string | null;
    cloudinary_url?: string | null;
    cloudinary_public_id?: string | null;
    cloudinary_resource_type?: "image" | "video" | "raw" | null;
    event_date: string;
    end_date?: string | null;
    start_time: string;
    end_time: string;
    status?: string;
    images?: EventImage[];
    main_image?: EventImage | null;
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
    state?: string;
    venue: string;
    event_date: string;
    end_date?: string;
    start_time: string;
    end_time: string;
    file_name?: File[];
    mainImageIndex?: number;
}

export interface UpdateEventePayload {
    id: string;
    title?: string;
    description?: string;
    state?: string;
    venue?: string;
    event_date: string;
    end_date?: string;
    start_time: string;
    end_time: string;
    file_name?: File[];
    mainImageIndex?: number;
    data?: string;
}
