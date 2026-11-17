"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getBannerById } from "@/store/redux/slice/bannerSlice";
import { FileUpload } from "@/components/ui/fileupload/file-upload";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function BannerEditPage() {
  const { id } = useParams();
  const bannerId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { banner, loading, error } = useSelector((state: RootState) => state.banner);

  useEffect(() => {
    if (bannerId) dispatch(getBannerById(bannerId));
  }, [bannerId, dispatch]);

  return (
    <AdminFormShell
      pageTitle="Edit Banner"
      listPath="/banner-table"
      listLabel="Banners"
      cardTitle="Edit Banner"
      description="Update the banner below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading banner</p>}
      {!loading && !error && banner && (
        <FileUpload
          mode="edit"
          initialBanner={banner as never}
          onSuccess={() => router.push(`/banners/${bannerId}`)}
        />
      )}
    </AdminFormShell>
  );
}
