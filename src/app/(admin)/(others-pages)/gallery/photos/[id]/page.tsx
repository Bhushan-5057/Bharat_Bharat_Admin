"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getPhotoById } from "@/store/redux/slice/photoSlice";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";
import { getMediaUrl } from "@/utils/mediaUrl";
import { Label } from "@/components/ui/label/label";

export default function PhotoDetailPage() {
  const { id } = useParams();
  const photoId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { photo, loading, error } = useSelector((state: RootState) => state.photos);

  useEffect(() => {
    if (photoId) dispatch(getPhotoById(photoId));
  }, [photoId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="Photo Details" path="/gallery/photos-table" label="Photos" />
      <AdminPageActions
        backHref="/gallery/photos-table"
        editHref={photoId ? `/gallery/photos/${photoId}/edit` : undefined}
        editLabel="Edit Photo"
      />
      {loading && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading photo</p>}
      {!loading && !error && photo && (
        <div className="space-y-4 max-w-3xl">
          <div className="space-y-1">
            <Label className="text-gray-500">File</Label>
            <p>{photo.file_name}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-gray-500">Created By</Label>
            <p>{photo.creator?.name || "N/A"}</p>
          </div>
          {getMediaUrl(photo) ? (
            <div className="relative w-full h-80 rounded-lg overflow-hidden">
              <Image src={getMediaUrl(photo)} alt={photo.file_name || "Photo"} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <p className="text-sm text-gray-500">No image</p>
          )}
        </div>
      )}
    </div>
  );
}
