import {
  Achievement,
  AchievementImage,
  AchievementQueryParams,
  CreateAchievementPayload,
  UpdateAchievementPayload,
} from "@/types/achievementTypes";
import axiosInstance from "./axiosInstance";

interface AchievementApiRecord {
  id: number;
  title: string;
  description: string;
  address?: string | null;
  school_address?: string | null;
  created_by: number;
  creator?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
  images?: AchievementImage[];
}

interface AchievementEnvelope {
  message?: string;
  achievement?: AchievementApiRecord;
  education?: AchievementApiRecord;
  educatiuonWithRelaion?: AchievementApiRecord;
}

function unwrapAchievementRecord(data: unknown): AchievementApiRecord {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid achievement response");
  }

  const envelope = data as AchievementEnvelope & AchievementApiRecord;
  return (
    envelope.achievement ||
    envelope.education ||
    envelope.educatiuonWithRelaion ||
    envelope
  );
}

function toAchievement(raw: AchievementApiRecord): Achievement {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    address: raw.address ?? raw.school_address ?? null,
    created_by: raw.created_by,
    creator: raw.creator,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    images: raw.images ?? [],
  };
}

export const fetchAllAchievements = async (
  params: AchievementQueryParams = {}
): Promise<Achievement[]> => {
  const defaultParams = { page: 1, limit: 100, ...params };
  const response = await axiosInstance.get("/achievements/get-all", {
    params: defaultParams,
  });

  const data = response.data as unknown;
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown }).data)
      ? (data as { data: AchievementApiRecord[] }).data
      : [];

  return list.map((item) => toAchievement(item as AchievementApiRecord));
};

export const fetchAchievementById = async (
  id: string | number
): Promise<Achievement> => {
  const response = await axiosInstance.get(`/achievements/get/${id}`);
  return toAchievement(unwrapAchievementRecord(response.data));
};

export const createAchievement = async (
  payload: CreateAchievementPayload
): Promise<Achievement> => {
  const formData = new FormData();

  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.address) formData.append("address", payload.address);

  if (payload.file_name && payload.file_name.length > 0) {
    payload.file_name.forEach((file, index) => {
      formData.append("file_name", file);
      formData.append(
        "is_main",
        index === payload.mainImageIndex ? "true" : "false"
      );
    });
  }

  const response = await axiosInstance.post("/achievements/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return toAchievement(unwrapAchievementRecord(response.data));
};

export const updateAchievement = async (
  id: string | number,
  payload: UpdateAchievementPayload
): Promise<Achievement> => {
  const formData = new FormData();

  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.address !== undefined) {
    formData.append("address", payload.address ?? "");
  }

  if (payload.images?.length) {
    payload.images.forEach((img) => {
      if (img.achievement_id) {
        formData.append(
          "existing_images[]",
          JSON.stringify({ id: img.achievement_id, is_main: img.is_main })
        );
      } else if (img.data instanceof File) {
        formData.append("file_name", img.data);
        formData.append("is_main", img.is_main ? "true" : "false");
      }
    });
  }

  const response = await axiosInstance.put(
    `/achievements/update/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return toAchievement(unwrapAchievementRecord(response.data));
};

export const deleteAchievement = async (id: string | number) => {
  const response = await axiosInstance.delete(`/achievements/delete/${id}`);
  return response.data;
};

export const fetchAchievementImages = async (
  id: string | number
): Promise<AchievementImage[]> => {
  const achievement = await fetchAchievementById(id);
  return achievement.images;
};

export const deleteAchievementImage = async (id: string | number) => {
  const response = await axiosInstance.delete(
    `/achievements/images/delete/${id}`
  );
  return response.data;
};

export const updateAchievementImage = async (
  id: string | number,
  data: { is_main: boolean }
) => {
  const response = await axiosInstance.put(
    `/achievements/images/update/${id}`,
    data
  );
  return response.data;
};
