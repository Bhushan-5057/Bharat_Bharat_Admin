"use client";

import { fetchAllEventsThunk } from "@/store/redux/slice/eventSlice";
import { AppDispatch, RootState } from "@/store/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { formatCreatedAt } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

function RecentCard() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const { events = [], loading, error } = useSelector(
        (state: RootState) => state.events
    );

    useEffect(() => {
        dispatch(fetchAllEventsThunk());
    }, [dispatch]);

    const recentEvents = events.slice(-3).reverse();

    return (
        <div>
            {loading ? (
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-4 rounded-lg border bg-gray-50 dark:bg-gray-900 animate-pulse"
                        >
                            <div className="w-16 h-16 rounded-md bg-gray-300 dark:bg-gray-700 flex-shrink-0"></div>
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="h-3 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                <div className="h-3 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <p className="text-red-500">Failed to load events.</p>
            ) : recentEvents.length === 0 ? (
                <p className="text-gray-500">No recent events found.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {recentEvents.map((event, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition bg-gray-50 dark:bg-gray-900"
                        >
                            {event.data ? (
                                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                    <Image
                                        src={`data:image/${event.file_name?.endsWith(".svg") ? "svg+xml" : "png"
                                            };base64,${event.data}`}
                                        alt={event.title || "event"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 flex items-center justify-center rounded-md bg-gray-200 text-gray-500 text-sm">
                                    No Image
                                </div>
                            )}

                            <div className="flex flex-col gap-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-1">
                                    {event.title || "Untitled"}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {event.description || "No description"}
                                </p>

                                {!event?.date && (
                                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-600 dark:text-gray-300">
                                        <CalendarDays size={14} />
                                        <span>{formatCreatedAt(event?.createdAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {events?.length > 3 && (
                <Button
                    onClick={() => router.push("/event-table")}
                    className="bg-gray-100 text-black hover:bg-gray-200 mt-4 w-full"
                >
                    View All Events
                </Button>
            )}
        </div>
    );
}

export default RecentCard;
