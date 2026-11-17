"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getVideoById } from "@/store/redux/slice/videoSlice";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";
import { Label } from "@/components/ui/label/label";

function getEmbedUrl(url?: string) {
  if (!url) return "";
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  const videoId = match?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export default function VideoDetailPage() {
  const { id } = useParams();
  const videoId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { video, loading, error } = useSelector((state: RootState) => state.video);

  useEffect(() => {
    if (videoId) dispatch(getVideoById(videoId));
  }, [videoId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="Video Details" path="/gallery/videos-table" label="Videos" />
      <AdminPageActions
        backHref="/gallery/videos-table"
        editHref={videoId ? `/gallery/videos/${videoId}/edit` : undefined}
        editLabel="Edit Video"
      />
      {loading && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading video</p>}
      {!loading && !error && video && (
        <div className="space-y-4 max-w-3xl">
          <div className="relative w-full pt-[56.25%]">
            <iframe
              src={getEmbedUrl(video.youtube_url)}
              title={video.description || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-md"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-gray-500">Description</Label>
            <p className="whitespace-pre-wrap break-words">{video.description || "N/A"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
