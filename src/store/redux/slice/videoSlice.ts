import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllVideos,
  fetchVideoById,
  uploadVideo,
  deleteVideo,
  updateVideoApi,
} from "@/store/api/videoApi";
import { AxiosError } from "axios";

export interface Video {
  id: string;
  title: string;
  description?: string;
  youtube_url?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  creator?: {
    id: number;
    name: string;
  };
  
}

interface VideoState {
  videos: Video[];
  video: Video | null;
  loading: boolean;
  error: string | null;
}

const initialState: VideoState = {
  videos: [],
  video: null,
  loading: false,
  error: null,
};


export const getVideos = createAsyncThunk<
  Video[],
  Record<string, unknown> | undefined,
  { rejectValue: string }
>("video/getAll", async (params = {}, { rejectWithValue }) => {
  try {
    return await fetchAllVideos(params);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch videos");
  }
});


export const getVideoById = createAsyncThunk<
  Video,
  string,
  { rejectValue: string }
>("video/getById", async (id, { rejectWithValue }) => {
  try {
    return await fetchVideoById(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch video");
  }
});


export const addVideo = createAsyncThunk<
  Video,
  { payload: { youtube_url: string; description: string } },
  { rejectValue: string }
>("video/create", async ({ payload }, { rejectWithValue }) => {
  try {
    return await uploadVideo(payload);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to create video");
  }
});



export const removeVideo = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("video/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteVideo(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to delete video");
  }
});


export const updateVideo = createAsyncThunk<
  Video,
  { id: string; youtube_url: string; description: string },
  { rejectValue: string }
>(
  "video/update",
  async ({ id, youtube_url, description }, { rejectWithValue }) => {
    try {
      const payload = { youtube_url, description };
      return await updateVideoApi(id, payload); 
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return rejectWithValue(error.response?.data?.message || "Failed to update video");
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    clearVideoState: (state) => {
      state.video = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(getVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(getVideoById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.video = action.payload;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(addVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.push(action.payload);
      })
      .addCase(addVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(removeVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = state.videos.filter((v) => v.id !== action.meta.arg);
      })
      .addCase(removeVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
          .addCase(updateVideo.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateVideo.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.videos.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) {
        state.videos[index] = action.payload;
      }
    })
    .addCase(updateVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update video";
    });
  },
});

export const { clearVideoState } = videoSlice.actions;
export default videoSlice.reducer;
