export type MediaRecord = {
  url?: string | null;
  cloudinary_url?: string | null;
  cloudinary_public_id?: string | null;
  cloudinary_resource_type?: "image" | "video" | "raw" | null;
  data?: unknown;
  file_name?: string | null;
  is_main?: boolean;
};

export function getMediaUrl(record?: MediaRecord | string | null): string {
  if (!record) return "";
  if (typeof record === "string") return record;
  const rawData = typeof record.data === "string" ? record.data : "";
  return (
    record.url ||
    record.cloudinary_url ||
    (rawData
      ? rawData.startsWith("data:")
        ? rawData
        : `data:image/jpeg;base64,${rawData}`
      : "")
  );
}

export type DisplayImageRecord = MediaRecord & {
  main_image?: MediaRecord | null;
  images?: MediaRecord[];
};

export function getDisplayImageUrl(item?: DisplayImageRecord | null): string {
  if (!item) return "";
  const mainFromList = item.images?.find((img) => img.is_main) || item.images?.[0];
  return (
    getMediaUrl(item.main_image) ||
    getMediaUrl(item) ||
    getMediaUrl(mainFromList)
  );
}

export function isPdfMedia(record?: MediaRecord | string | null): boolean {
  if (!record) return false;
  if (typeof record === "string") {
    const name = record.toLowerCase();
    return (
      name.endsWith(".pdf") ||
      name.includes(".pdf?") ||
      name.includes("/raw/upload/") ||
      name.startsWith("data:application/pdf")
    );
  }
  const type = record.cloudinary_resource_type;
  const name = String(record.file_name || record.url || record.cloudinary_url || "").toLowerCase();
  const url = String(record.url || record.cloudinary_url || "").toLowerCase();
  return (
    type === "raw" ||
    name.endsWith(".pdf") ||
    name.includes(".pdf?") ||
    url.includes("/raw/upload/") ||
    url.startsWith("data:application/pdf")
  );
}
