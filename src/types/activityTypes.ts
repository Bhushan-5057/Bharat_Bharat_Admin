// activityTypes.ts

export interface Activity {
  id: string;

  title: string;

  description?: string;

  // NEW FIELDS
  venue?: string;

  date?: string;

  start_time?: string;

  end_time?: string;

  file_name?: string;

  data?: string;

  creator?: {
    id: number;
    name: string;
  };

  createdAt?: string;

  updatedAt?: string;
}


export interface CreateActivityPayload {
  title: string;

  description?: string;

  // NEW FIELDS
  venue: string;

  date: string;

  start_time: string;

  end_time: string;

  file_name?: File;
}


export interface UpdateActivityPayload {
  id: string;

  title?: string;

  description?: string;

  // NEW FIELDS
  venue?: string;

  date?: string;

  start_time?: string;

  end_time?: string;

  file_name?: File;

  data?: string;
}