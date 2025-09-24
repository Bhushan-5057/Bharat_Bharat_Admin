import {
  createUser,
  deleteUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
  updateUserStatus,
} from "@/store/api/userApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface User {
  id: string;
  status: string;
  name: string;
  email: string;
  password?: string;
  created_by?: string;
}

interface UserState {
  users: User[];
  selectedUser?: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  message: null,
};

interface CreateUserPayload {
  name: string;
  email: string;
  status?: string;
  password: string;
}

interface UpdateUserPayload {
  id: string;
  name: string;
  email: string;
  status?: string;
  password?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const errObj = error as { response?: { data?: string } };
    return errObj.response?.data || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export const createUserThunk = createAsyncThunk(
  "user/createUser",
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await createUser(payload);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to create user"));
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "user/updateUser",
  async (payload: UpdateUserPayload, { rejectWithValue }) => {
    try {
      const response = await updateUser(payload);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to update user"));
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  "user/deleteUser",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await deleteUser(id);
      return { id, message: response.message || "User deleted" };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete user"));
    }
  }
);

export const fetchAllUsersThunk = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const users = await fetchAllUsers();
      return users;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch users"));
    }
  }
);

export const fetchUserByIdThunk = createAsyncThunk(
  "user/fetchUserById",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const user = await fetchUserById(id);
      return user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch user"));
    }
  }
);

export const updateUserStatusThunk = createAsyncThunk(
  "user/updateUserStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserStatus(id, status);
      return { id, status, message: response.message || "User status updated" };
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update user status")
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data || [];
        state.message = "Users fetched successfully";
      })
      .addCase(fetchAllUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = "Failed to fetch users";
      })
      .addCase(fetchUserByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.message = "User fetched successfully";
      })
      .addCase(fetchUserByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = "Failed to fetch user";
      })
      .addCase(createUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user || action.payload);
        state.message = action.payload.message || "User created successfully";
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = "Failed to create user";
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user || action.payload;
        const index = state.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1)
          state.users[index] = { ...state.users[index], ...updatedUser };
        state.message = "User updated successfully";
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = "Failed to update user";
      })
      .addCase(updateUserStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status, message } = action.payload;
        const user = state.users.find((u) => u.id === id);
        if (user) user.status = status;
        state.message = message;
      })
      .addCase(updateUserStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = "Failed to update user status";
      });
  },
});

export default userSlice.reducer;
