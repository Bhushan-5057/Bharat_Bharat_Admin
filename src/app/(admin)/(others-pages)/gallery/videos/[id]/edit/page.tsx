"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getVideoById, getVideos } from "@/store/redux/slice/videoSlice";
import { VideoUploadForm } from "@/components/form/VideoUploadForm/VideoUploadForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function VideoEditPage() {
  const { id } = useParams();
  const videoId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { video, loading, error } = useSelector((state: RootState) => state.video);

  useEffect(() => {
    if (videoId) dispatch(getVideoById(videoId));
  }, [videoId, dispatch]);

  return (
    <AdminFormShell
      pageTitle="Edit Video"
      listPath="/gallery/videos-table"
      listLabel="Videos"
      cardTitle="Edit Video"
      description="Update the video details below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading video</p>}
      {!loading && !error && video && (
        <VideoUploadForm
          mode="edit"
          initialVideo={{
            id: video.id,
            youtube_url: video.youtube_url || "",
            description: video.description || "",
          }}
          onSuccess={() => {
            dispatch(getVideos());
            router.push(`/gallery/videos/${videoId}`);
          }}
        />
      )}
    </AdminFormShell>
  );
}
