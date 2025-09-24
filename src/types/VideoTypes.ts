export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VideoType {
  id: string;
  youtube_url: string;
  description?: string;
  creator?: { name?: string };
}
