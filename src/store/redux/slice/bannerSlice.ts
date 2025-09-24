import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllBanners,
  fetchBannerById,
  uploadBanner,
  updateBanner,
  deleteBanner,
  CreateBannerPayload,
  UpdateBannerPayload,
} from "@/store/api/bannerApi";
import { AxiosError } from "axios";
import { Banner, BannerState } from "@/types/bannerType";



const initialState: BannerState = {
  banners: [],
  banner: null,
  loading: false,
  error: null,
};


export const getBanners = createAsyncThunk<
  Banner[], 
  Record<string, unknown> | undefined, 
  { rejectValue: string } 
>("banner/getAll", async (params = {}, { rejectWithValue }) => {
  try {
    return await fetchAllBanners(params);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch banners");
  }
});

export const getBannerById = createAsyncThunk<
  Banner,
  string,
  { rejectValue: string }
>("banner/getById", async (id, { rejectWithValue }) => {
  try {
    return await fetchBannerById(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch banner");
  }
});

export const addBanner = createAsyncThunk<
  Banner,
  { file: File; payload: CreateBannerPayload },
  { rejectValue: string }
>("banner/create", async ({ file, payload }, { rejectWithValue }) => {
  try {
    return await uploadBanner(file, payload);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to create banner");
  }
});

export const editBanner = createAsyncThunk<
  Banner,
  { id: string; payload: UpdateBannerPayload },
  { rejectValue: string }
>("banner/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateBanner(id, payload);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to update banner");
  }
});

export const removeBanner = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("banner/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteBanner(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to delete banner");
  }
});

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    clearBannerState: (state) => {
      state.banner = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(getBannerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBannerById.fulfilled, (state, action) => {
        state.loading = false;
        state.banner = action.payload;
      })
      .addCase(getBannerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(addBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
      })
      .addCase(addBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(editBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.map((b) =>
          b.id === action.payload.id ? action.payload : b
        );
      })
      .addCase(editBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(removeBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter((b) => b.id !== action.meta.arg);
      })
      .addCase(removeBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearBannerState } = bannerSlice.actions;
export default bannerSlice.reducer;
