import axiosInstance from "./axiosInstance";
import {
  Member,
  MemberPayload,
  MemberQueryParams,
  MembersResponse,
} from "@/types/memberTypes";

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const pickNumber = (source: ApiRecord | undefined, keys: string[]) => {
  if (!source) return undefined;

  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") {
      const parsed = Number(value);
      if (Number.isFinite(parsed) && parsed >= 0) {
        return parsed;
      }
    }
  }

  return undefined;
};

const pickMembers = (source: ApiRecord | undefined): Member[] | undefined => {
  if (!source) return undefined;

  const candidates = [source.data, source.members, source.rows, source.items];
  const list = candidates.find(Array.isArray);

  return list as Member[] | undefined;
};

const normalizeMembersResponse = (
  responseData: unknown,
  params: MemberQueryParams
): MembersResponse => {
  const page = params.page || 1;
  const limit = params.limit || 10;

  if (Array.isArray(responseData)) {
    return {
      data: responseData as Member[],
      total: responseData.length,
      page,
      limit,
      totalPages: Math.ceil(responseData.length / limit) || 1,
    };
  }

  if (!isRecord(responseData)) {
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 1,
    };
  }

  const nestedData = isRecord(responseData.data) ? responseData.data : undefined;
  const result = nestedData || responseData;
  const pagination =
    (isRecord(result.pagination) && result.pagination) ||
    (isRecord(result.meta) && result.meta) ||
    (isRecord(responseData.pagination) && responseData.pagination) ||
    (isRecord(responseData.meta) && responseData.meta) ||
    result;

  const data = pickMembers(result) || pickMembers(responseData) || [];
  const total =
    pickNumber(pagination, [
      "total",
      "count",
      "totalCount",
      "totalItems",
      "totalRecords",
    ]) ?? data.length;
  const resolvedLimit = toNumber(
    pickNumber(pagination, ["limit", "perPage", "pageSize", "take"]),
    limit
  );
  const resolvedPage = toNumber(
    pickNumber(pagination, ["page", "currentPage", "current_page"]),
    page
  );
  const explicitTotalPages = pickNumber(pagination, [
    "totalPages",
    "total_pages",
    "lastPage",
    "last_page",
    "pages",
  ]);

  return {
    data,
    total,
    page: resolvedPage,
    limit: resolvedLimit,
    totalPages: toNumber(
      explicitTotalPages,
      Math.ceil(total / resolvedLimit) || 1
    ),
  };
};

export const fetchAllMembers = async (
  params: MemberQueryParams = {}
): Promise<MembersResponse> => {
  const queryParams: MemberQueryParams = {
    page: 1,
    limit: 10,
    ...params,
  };

  const response = await axiosInstance.get("/members/get-all", {
    params: queryParams,
  });

  return normalizeMembersResponse(response.data, queryParams);
};

export const fetchMemberById = async (id: string | number): Promise<Member> => {
  const response = await axiosInstance.get(`/members/get/${id}`);
  return response.data?.data || response.data?.member || response.data;
};

export const createMember = async (payload: MemberPayload): Promise<Member> => {
  const response = await axiosInstance.post("/members/create", payload);
  return response.data;
};

export const updateMember = async (
  id: string | number,
  payload: MemberPayload
): Promise<Member> => {
  const response = await axiosInstance.put(`/members/update/${id}`, payload);
  return response.data;
};

export const deleteMember = async (id: string | number) => {
  const response = await axiosInstance.delete(`/members/delete/${id}`);
  return response.data;
};
