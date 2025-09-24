import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllPhotos,
  fetchPhotoById,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  CreatePhotoPayload,
  UpdatePhotoPayload,
  Photo,
} from "@/store/api/photoApi";
import { AxiosError } from "axios";


interface PhotoState {
  photos: Photo[];
  photo: Photo | null;
  loading: boolean;
  error: string | null;
}

const initialState: PhotoState = {
  photos: [],
  photo: null,
  loading: false,
  error: null,
};


export const getPhotos = createAsyncThunk<
  Photo[],
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("photo/getAll", async (params = {}, { rejectWithValue }) => {
  try {
    return await fetchAllPhotos(params);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch photos");
  }
});


export const getPhotoById = createAsyncThunk<
  Photo,
  string,
  { rejectValue: string }
>("photo/getById", async (id, { rejectWithValue }) => {
  try {
    return await fetchPhotoById(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch photo");
  }
});


export const addPhoto = createAsyncThunk<
  Photo,
  { file: File; payload: CreatePhotoPayload },
  { rejectValue: string }
>("photo/create", async ({ file, payload }, { rejectWithValue }) => {
  try {
    return await uploadPhoto(file, payload);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to create photo");
  }
});


export const editPhoto = createAsyncThunk<
  Photo,
  { id: string; payload: UpdatePhotoPayload },
  { rejectValue: string }
>("photo/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updatePhoto(id, payload);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to update photo");
  }
});


export const removePhoto = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("photo/delete", async (id, { rejectWithValue }) => {
  try {
    await deletePhoto(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to delete photo");
  }
});

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    clearPhotoState: (state) => {
      state.photo = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(getPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(getPhotoById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPhotoById.fulfilled, (state, action) => {
        state.loading = false;
        state.photo = action.payload;
      })
      .addCase(getPhotoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(addPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos.push(action.payload);
      })
      .addCase(addPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(editPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = state.photos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      })
      .addCase(editPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(removePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = state.photos.filter((p) => p.id !== Number(action.meta.arg));
      })
      .addCase(removePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearPhotoState } = photoSlice.actions;
export default photoSlice.reducer;
