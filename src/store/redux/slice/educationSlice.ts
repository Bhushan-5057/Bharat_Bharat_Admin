import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllEducations,
  fetchEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
  fetchEducationImages,
  deleteEducationImage,
  updateEducationImage,
} from "@/store/api/educationApi";
import { AxiosError } from "axios";
import { CreateEducationPayload, Education, EducationImage, EducationState, UpdateEducationPayload } from "@/types/educationTypes";



const initialState: EducationState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};


export const getAllEducations = createAsyncThunk<
  Education[],
  void,
  { rejectValue: string }
>("education/getAll", async (_, { rejectWithValue }) => {
  try {
    return await fetchAllEducations();
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch educations");
  }
});


export const getEducationById = createAsyncThunk<
  Education,
  string | number,
  { rejectValue: string }
>("education/getById", async (id, { rejectWithValue }) => {
  try {
    return await fetchEducationById(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch education");
  }
});


export const addEducation = createAsyncThunk<
  Education,
  CreateEducationPayload,
  { rejectValue: string }
>("education/create", async (payload, { rejectWithValue }) => {
  try {
    return await createEducation(payload);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to create education");
  }
});


export const editEducation = createAsyncThunk<
  Education,
  { id: string | number; payload: UpdateEducationPayload },
  { rejectValue: string }
>("education/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await updateEducation(id, payload);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to update education");
  }
});


export const editEducationImage = createAsyncThunk<
  unknown,
  { id: string | number; is_main: boolean },
  { rejectValue: string }
>("education/updateImage", async ({ id, is_main }, { rejectWithValue }) => {
  try {
    return await updateEducationImage(id, { is_main });
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to update image");
  }
});

export const removeEducation = createAsyncThunk<
  void,
  string | number,
  { rejectValue: string }
>("education/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteEducation(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to delete education");
  }
});

export const removeEducationImage = createAsyncThunk<
  void,
  string | number,
  { rejectValue: string }
>("education/deleteImage", async (id, { rejectWithValue }) => {
  try {
    await deleteEducationImage(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to delete image");
  }
});

export const getEducationImages = createAsyncThunk<
  EducationImage[],
  string | number,
  { rejectValue: string }
>("education/getImages", async (id, { rejectWithValue }) => {
  try {
    return await fetchEducationImages(id);
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to fetch images");
  }
});

const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    resetSelectedEducation(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAllEducations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEducations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllEducations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(getEducationById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = null;
      })
      .addCase(getEducationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getEducationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch education";
      })

      .addCase(addEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create education";
      })

      .addCase(editEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEducation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(editEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update education";
      })

      .addCase(removeEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.meta.arg);
      })
      .addCase(removeEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete education";
      });
    builder
      .addCase(editEducationImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editEducationImage.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload as { id: string | number; is_main: boolean };

        if (state.selected?.images) {
          state.selected.images = state.selected.images.map((img) =>
            img.id === payload.id
              ? { ...img, is_main: payload.is_main }
              : { ...img, is_main: false }
          );
        }
      })
      .addCase(editEducationImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update image";
      });


  },
});

export const { resetSelectedEducation } = educationSlice.actions;

export default educationSlice.reducer;
