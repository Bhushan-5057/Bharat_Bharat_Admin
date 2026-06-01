import {
  createUser,
  deleteUser,
  fetchAllUsers,
  fetchUserById,
  updateUser,
} from "@/store/api/userApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "super_admin" | string;
  password?: string;
  created_by?: string | number | { id?: string | number; name?: string };
  creator?: {
    name?: string;
  };
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
  password: string;
  role?: "admin" | "super_admin";
}

interface UpdateUserPayload {
  id: string;
  name: string;
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
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload.id);
        state.message = action.payload.message;
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = "Failed to delete user";
      });
  },
});

export default userSlice.reducer;
