export const MEMBER_CATEGORIES = [
  "national excutive council",
  "national core commitee",
] as const;

export type MemberCategory = (typeof MEMBER_CATEGORIES)[number];

export interface Member {
  id: string | number;
  name: string;
  designation?: string | null;
  category: MemberCategory | string;
  createdAt?: string;
  updatedAt?: string;
  created_by?: number | string;
  creator?: {
    id: number | string;
    name: string;
  };
}

export interface MemberQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: "name" | "category" | "designation" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface MemberPayload {
  name: string;
  category: MemberCategory;
  designation?: string;
}

export interface MembersResponse {
  data: Member[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
