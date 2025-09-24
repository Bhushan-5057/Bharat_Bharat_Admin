import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllOfficeBearers,
  fetchOfficeBearerById,
  createOfficeBearer,
  updateOfficeBearer,
  deleteOfficeBearer,
  CreateOfficeBearerPayload,
  UpdateOfficeBearerPayload,
} from "@/store/api/officeBearerApi";
import { AxiosError } from "axios";
import { OfficeBearer, OfficeBearerState } from "@/types/officeBearerTypes";


const initialState: OfficeBearerState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};


export const getAllOfficeBearers = createAsyncThunk<
  OfficeBearer[], 
  void, 
  { rejectValue: string }
>("officeBearer/getAll", async (_, { rejectWithValue }) => {
  try {
    return await fetchAllOfficeBearers();
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch office bearers");
  }
});

export const getOfficeBearerById = createAsyncThunk<
  OfficeBearer,
  string | number,
  { rejectValue: string }
>("officeBearer/getById", async (id, { rejectWithValue }) => {
  try {
    return await fetchOfficeBearerById(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch office bearer");
  }
});

export const addOfficeBearer = createAsyncThunk<
  OfficeBearer,
  CreateOfficeBearerPayload,
  { rejectValue: string }
>("officeBearer/create", async (payload, { rejectWithValue }) => {
  try {
    return await createOfficeBearer(payload);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to create office bearer");
  }
});

export const editOfficeBearer = createAsyncThunk<
  OfficeBearer,
  { id: string | number; payload: UpdateOfficeBearerPayload },
  { rejectValue: string }
>("officeBearer/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateOfficeBearer(id, payload);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to update office bearer");
  }
});

export const removeOfficeBearer = createAsyncThunk<
  void,
  string | number,
  { rejectValue: string }
>("officeBearer/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteOfficeBearer(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to delete office bearer");
  }
});

// ✅ Slice
const officeBearerSlice = createSlice({
  name: "officeBearer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAll
      .addCase(getAllOfficeBearers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOfficeBearers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllOfficeBearers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      // getById
      .addCase(getOfficeBearerById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      // create
      .addCase(addOfficeBearer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // update
      .addCase(editOfficeBearer.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      // delete
      .addCase(removeOfficeBearer.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.meta.arg);
      });
  },
});

export default officeBearerSlice.reducer;
