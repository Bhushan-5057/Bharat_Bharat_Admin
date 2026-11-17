"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getBannerById } from "@/store/redux/slice/bannerSlice";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";
import { getMediaUrl } from "@/utils/mediaUrl";
import { Label } from "@/components/ui/label/label";

export default function BannerDetailPage() {
  const { id } = useParams();
  const bannerId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { banner, loading, error } = useSelector((state: RootState) => state.banner);

  useEffect(() => {
    if (bannerId) dispatch(getBannerById(bannerId));
  }, [bannerId, dispatch]);

  const mediaSrc = banner ? getMediaUrl(banner as never) : "";

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="Banner Details" path="/banner-table" label="Banners" />
      <AdminPageActions
        backHref="/banner-table"
        editHref={bannerId ? `/banners/${bannerId}/edit` : undefined}
        editLabel="Edit Banner"
      />
      {loading && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading banner</p>}
      {!loading && !error && banner && (
        <div className="space-y-4 max-w-3xl">
          <div className="space-y-1">
            <Label className="text-gray-500">Title</Label>
            <p>{banner.title || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-gray-500">Description</Label>
            <p>{banner.description || "N/A"}</p>
          </div>
          {mediaSrc ? (
            <div className="relative w-full h-80 rounded-lg overflow-hidden">
              <Image src={mediaSrc} alt={banner.title || "Banner"} fill className="object-cover" />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
