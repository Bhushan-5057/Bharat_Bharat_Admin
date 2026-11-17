"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getPhotoById, getPhotos } from "@/store/redux/slice/photoSlice";
import { PhotoUploadForm } from "@/components/form/PhotoUploadForm/PhotoUploadForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function PhotoEditPage() {
  const { id } = useParams();
  const photoId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { photo, loading, error } = useSelector((state: RootState) => state.photos);

  useEffect(() => {
    if (photoId) dispatch(getPhotoById(photoId));
  }, [photoId, dispatch]);

  return (
    <AdminFormShell
      pageTitle="Edit Photo"
      listPath="/gallery/photos-table"
      listLabel="Photos"
      cardTitle="Edit Photo"
      description="Update the photo below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading photo</p>}
      {!loading && !error && photo && (
        <PhotoUploadForm
          mode="edit"
          initialPhoto={photo}
          onSuccess={() => {
            dispatch(getPhotos());
            router.push(`/gallery/photos/${photoId}`);
          }}
        />
      )}
    </AdminFormShell>
  );
}
