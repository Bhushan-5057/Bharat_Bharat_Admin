import {
  fetchAllServices,
  fetchServiceById,
  createService,
  updateService,
  deleteService,
  CreateServicePayload,
  UpdateServicePayload,
} from "@/store/api/serviceApi";
import { ServiceState } from "@/types/serviceTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState: ServiceState = {
  services: [],
  selectedService: null,
  loading: false,
  error: null,
};


export const fetchAllServicesThunk = createAsyncThunk(
  "services/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllServices();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch services";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchServiceByIdThunk = createAsyncThunk(
  "services/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchServiceById(id);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch service";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createServiceThunk = createAsyncThunk(
  "services/create",
  async (payload: CreateServicePayload, { rejectWithValue }) => {
    try {
      return await createService(payload);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create service";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateServiceThunk = createAsyncThunk(
  "services/update",
  async (payload: UpdateServicePayload, { rejectWithValue }) => {
    try {
      return await updateService(payload);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update service";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteServiceThunk = createAsyncThunk(
  "services/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteService(id);
      return id;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete service";
      return rejectWithValue(errorMessage);
    }
  }
);


const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    clearSelectedService: (state) => {
      state.selectedService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllServicesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllServicesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchAllServicesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchServiceByIdThunk.fulfilled, (state, action) => {
        state.selectedService = action.payload;
      })
      .addCase(createServiceThunk.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(updateServiceThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        state.services = state.services.map((s) =>
          s.id === updated.id ? updated : s
        );
      })
      .addCase(deleteServiceThunk.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s.id !== action.payload);
      });
  },
});

export const { clearSelectedService } = serviceSlice.actions;
export default serviceSlice.reducer;
