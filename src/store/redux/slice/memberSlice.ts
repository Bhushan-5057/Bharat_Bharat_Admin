import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  createMember,
  deleteMember,
  fetchAllMembers,
  fetchMemberById,
  updateMember,
} from "@/store/api/memberApi";
import {
  Member,
  MemberPayload,
  MemberQueryParams,
  MembersResponse,
} from "@/types/memberTypes";

interface MemberState {
  members: Member[];
  member: Member | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: MemberState = {
  members: [],
  member: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  loading: false,
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};

export const getMembers = createAsyncThunk<MembersResponse, MemberQueryParams | undefined>(
  "member/getAll",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchAllMembers(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch members"));
    }
  }
);

export const getMemberById = createAsyncThunk(
  "member/getById",
  async (id: string | number, { rejectWithValue }) => {
    try {
      return await fetchMemberById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch member"));
    }
  }
);

export const addMember = createAsyncThunk(
  "member/create",
  async (payload: MemberPayload, { rejectWithValue }) => {
    try {
      return await createMember(payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to create member"));
    }
  }
);

export const editMember = createAsyncThunk(
  "member/update",
  async (
    { id, payload }: { id: string | number; payload: MemberPayload },
    { rejectWithValue }
  ) => {
    try {
      return await updateMember(id, payload);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update member"));
    }
  }
);

export const removeMember = createAsyncThunk(
  "member/delete",
  async (id: string | number, { rejectWithValue }) => {
    try {
      await deleteMember(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete member"));
    }
  }
);

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    clearMemberState: (state) => {
      state.member = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getMembers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string | undefined) ||
          action.error.message ||
          "Failed to fetch members";
      })
      .addCase(getMemberById.fulfilled, (state, action) => {
        state.member = action.payload;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.members.unshift(action.payload);
      })
      .addCase(editMember.fulfilled, (state, action) => {
        state.members = state.members.map((member) =>
          String(member.id) === String(action.payload.id) ? action.payload : member
        );
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (member) => String(member.id) !== String(action.payload)
        );
      });
  },
});

export const { clearMemberState } = memberSlice.actions;
export default memberSlice.reducer;
