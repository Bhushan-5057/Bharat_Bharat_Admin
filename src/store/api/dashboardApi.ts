import { Event } from "@/types/eventTypes";
import axiosInstance from "./axiosInstance";
import { Activity } from "@/types/activityTypes";
import { Service } from "@/types/serviceTypes";
import { Publication } from "@/types/publicationTypes";
import { OfficeBearer } from "@/types/officeBearerTypes";

export interface DashboardResponse {
    dashboard: {
        integrations: { count: number, items: Event[] };
        activities: { count: number, items: Activity[] };
        services: { count: number, items: Service[] };
        certificates: { count: number, items: Publication[] };
        officeBearers: { count: number, items: OfficeBearer[] };
    }
}

export const fetchDashboard = async (): Promise<DashboardResponse> => {
    const response = await axiosInstance.get<DashboardResponse>("/dashboard/get", {
        headers: { "Cache-Control": "no-cache" }, 
    });
    return response.data;
};
