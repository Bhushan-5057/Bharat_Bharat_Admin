import { getApiErrorMessage } from "@/lib/utils/apiError";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllAchievements,
  fetchAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  fetchAchievementImages,
  deleteAchievementImage,
  updateAchievementImage,
} from "@/store/api/achievementApi";
import {
  CreateAchievementPayload,
  Achievement,
  AchievementImage,
  AchievementState,
  UpdateAchievementPayload,
} from "@/types/achievementTypes";

const initialState: AchievementState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

export const getAllAchievements = createAsyncThunk<
  Achievement[],
  void,
  { rejectValue: string }
>("achievements/getAll", async (_, { rejectWithValue }) => {
  try {
    return await fetchAllAchievements();
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Failed to fetch achievements"));
  }
});

export const getAchievementById = createAsyncThunk<
  Achievement,
  string | number,
  { rejectValue: string }
>("achievements/getById", async (id, { rejectWithValue }) => {
  try {
    return await fetchAchievementById(id);
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Failed to fetch achievement"));
  }
});

export const addAchievement = createAsyncThunk<
  Achievement,
  CreateAchievementPayload,
  { rejectValue: string }
>("achievements/create", async (payload, { rejectWithValue }) => {
  try {
    return await createAchievement(payload);
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Failed to create achievement"));
  }
});

export const editAchievement = createAsyncThunk<
  Achievement,
  { id: string | number; payload: UpdateAchievementPayload },
  { rejectValue: string }
>("achievements/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateAchievement(id, payload);
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Failed to update achievement"));
  }
});

export const editAchievementImage = createAsyncThunk<
  { id: string | number; is_main: boolean },
  { id: string | number; is_main: boolean },
  { rejectValue: string }
>("achievements/updateImage", async ({ id, is_main }, { rejectWithValue }) => {
  try {
    await updateAchievementImage(id, { is_main });
    return { id, is_main };
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Failed to update image"));
  }
});

export const removeAchievement = createAsyncThunk<
  void,
  string | number,
  { rejectValue: string }
>("achievements/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteAchievement(id);
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Failed to delete achievement"));
  }
});

export const removeAchievementImage = createAsyncThunk<
  void,
  string | number,
  { rejectValue: string }
>("achievements/deleteImage", async (id, { rejectWithValue }) => {
  try {
    await deleteAchievementImage(id);
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Failed to delete image"));
  }
});

export const getAchievementImages = createAsyncThunk<
  AchievementImage[],
  string | number,
  { rejectValue: string }
>("achievements/getImages", async (id, { rejectWithValue }) => {
  try {
    return await fetchAchievementImages(id);
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Failed to fetch images"));
  }
});

const achievementSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    resetSelectedAchievement(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(getAchievementById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = null;
      })
      .addCase(getAchievementById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getAchievementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch achievement";
      })

      .addCase(addAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create achievement";
      })

      .addCase(editAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAchievement.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })
      .addCase(editAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update achievement";
      })

      .addCase(removeAchievement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAchievement.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.meta.arg);
      })
      .addCase(removeAchievement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete achievement";
      })

      .addCase(editAchievementImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAchievementImage.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        if (state.selected?.images) {
          state.selected.images = state.selected.images.map((img) =>
            img.id === payload.id
              ? { ...img, is_main: payload.is_main }
              : { ...img, is_main: false }
          );
        }
      })
      .addCase(editAchievementImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update image";
      });
  },
});

export const { resetSelectedAchievement } = achievementSlice.actions;

export default achievementSlice.reducer;
