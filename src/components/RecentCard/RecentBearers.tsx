"use client";

import { getAllOfficeBearers } from "@/store/redux/slice/officeBearerSlice";
import { AppDispatch, RootState } from "@/store/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

function RecentBearers() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items: officeBearers = [], loading } = useSelector(
    (state: RootState) => state.officeBearer
  );

  useEffect(() => {
    dispatch(getAllOfficeBearers());
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg border bg-gray-50 dark:bg-gray-900 animate-pulse"
            >
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : officeBearers.length > 0 ? (
        <div className="flex flex-col gap-4">
          {officeBearers.slice(-3).map((bearer, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-3 rounded-lg border hover:shadow-md transition bg-gray-50 dark:bg-gray-900"
            >
              {bearer.data ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={`data:image/${
                      bearer.file_name?.endsWith(".svg") ? "svg+xml" : "png"
                    };base64,${bearer.data}`}
                    alt={bearer.title || "bearer"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 flex items-center justify-center rounded-md bg-gray-200 text-gray-500 text-xs">
                  No Image
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {bearer.title || "—"}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {bearer.designation || "—"}
                </p>
                <p className="text-xs italic text-gray-600 dark:text-gray-300 line-clamp-2 break-words">
                  {bearer.quotes}
                </p>
                <p className="text-xs text-blue-600 truncate break-words">
                  {bearer.gmail || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No bearers found.</p>
      )}
      {officeBearers?.length > 3 && (
        <Button
          onClick={() => router.push("/bearer-table")}
          className="bg-gray-100 text-black hover:bg-gray-200 mt-4 w-full"
        >
          View All Bearers
        </Button>
      )}
    </div>
  );
}

export default RecentBearers;