import { CreatePublicationPayload, deletePublication, fetchAllPublications, fetchPublicationById, updatePublication, UpdatePublicationPayload, uploadPublication } from "@/store/api/publicationsApi";
import { Publication, PublicationState } from "@/types/publicationTypes";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";



const initialState: PublicationState = {
    publications: [],
    selectedPublication: null,
    loading: false,
    error: null,
    fileName: "",
};

interface ApiError {
    response?: {
        data?: string;
    };
    message: string;
}

export const getPublications = createAsyncThunk(
    "publications/getAll",
    async (_,{ rejectWithValue }) => {
        try {
            const data = await fetchAllPublications();
            return data;
        } catch (error: unknown) {
            const err = error as ApiError;
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createPublication = createAsyncThunk(
    "publications/create",
    async (payload: CreatePublicationPayload, { rejectWithValue }) => {
        try {
            const data = await uploadPublication(payload);
            return data;
        } catch (err: unknown) {
            const error = err as ApiError;
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const editPublication = createAsyncThunk(
    "publications/update",
    async ({ id, payload }: { id: number | string; payload: UpdatePublicationPayload }, { rejectWithValue }) => {
        try {
            const data = await updatePublication(id, payload);
            return data;
        } catch (error: unknown) {
            const err = error as ApiError;
            console.error("❌ Update publication failed:", err.response?.data || err.message);
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


export const removePublication = createAsyncThunk(
    "publications/delete",
    async (id: number | string, { rejectWithValue }) => {
        try {
            const data = await deletePublication(id);
            return { id, ...data };
        } catch (error: unknown) {
            const err = error as ApiError;
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const getPublicationById = createAsyncThunk(
  "certificate/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const { fileName } = await fetchPublicationById(id); 
      
      return { fileName };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch certificate"
      );
    }
  }
);


const publicationSlice = createSlice({
    name: "publications",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPublications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPublications.fulfilled, (state, action: PayloadAction<Publication[]>) => {
                state.loading = false;
                state.publications = action.payload;
            })
            .addCase(getPublications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createPublication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPublication.fulfilled, (state, action: PayloadAction<Publication>) => {
                state.loading = false;
                state.publications.unshift(action.payload);
            })
            .addCase(createPublication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(editPublication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editPublication.fulfilled, (state, action: PayloadAction<Publication>) => {
                state.loading = false;
                const index = state.publications.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) state.publications[index] = action.payload;
            })
            .addCase(editPublication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removePublication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removePublication.fulfilled, (state, action) => {
                state.loading = false;
                state.publications = state.publications.filter((p) => p.id !== action.payload.id);
            })
            .addCase(removePublication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(getPublicationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPublicationById.fulfilled, (state, action) => {
                state.loading = false;
                state.fileName = action.payload.fileName;
            })
            .addCase(getPublicationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.fileName = "";
            });
    },
});

export default publicationSlice.reducer;

