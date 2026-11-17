import { getApiErrorMessage } from "@/lib/utils/apiError";
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

function unwrapPublicationPayload(data: unknown): Publication {
    if (data && typeof data === "object" && !Array.isArray(data)) {
        const record = data as Record<string, unknown>;
        const wrapped = record.certificateWithRelation ?? record.updatedCertificate;
        if (wrapped && typeof wrapped === "object" && !Array.isArray(wrapped) && "id" in wrapped) {
            return wrapped as Publication;
        }
    }
    return data as Publication;
}

export const getPublications = createAsyncThunk(
    "publications/getAll",
    async (_,{ rejectWithValue }) => {
        try {
            const data = await fetchAllPublications();
            return data;
        } catch (error: unknown) {
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const createPublication = createAsyncThunk(
    "publications/create",
    async (payload: CreatePublicationPayload, { rejectWithValue }) => {
        try {
            const data = await uploadPublication(payload);
            return unwrapPublicationPayload(data);
        } catch (err: unknown) {
            return rejectWithValue(getApiErrorMessage(err));
        }
    }
);


export const editPublication = createAsyncThunk(
    "publications/update",
    async ({ id, payload }: { id: number | string; payload: UpdatePublicationPayload }, { rejectWithValue }) => {
        try {
            const data = await updatePublication(id, payload);
            return unwrapPublicationPayload(data);
        } catch (error: unknown) {
            console.error("❌ Update publication failed:", getApiErrorMessage(error));
            return rejectWithValue(getApiErrorMessage(error));
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
            return rejectWithValue(getApiErrorMessage(error));
        }
    }
);

export const getPublicationById = createAsyncThunk(
  "certificate/fetchById",
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const { publications } = getState() as { publications: PublicationState };
      const cached = publications.publications.find((item) => Number(item.id) === Number(id));
      if (cached) return cached;
      if (
        publications.selectedPublication &&
        Number(publications.selectedPublication.id) === Number(id)
      ) {
        return publications.selectedPublication;
      }
      return await fetchPublicationById(id);
    } catch (err: unknown) {
      return rejectWithValue(getApiErrorMessage(err, "Failed to fetch certificate"));
    }
  }
);


const publicationSlice = createSlice({
    name: "certificates",
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
                if (state.selectedPublication?.id === action.payload.id) {
                    state.selectedPublication = action.payload;
                    state.fileName = action.payload?.file_name || "";
                }
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
                state.selectedPublication = action.payload;
                state.fileName = action.payload?.file_name || "";
            })
            .addCase(getPublicationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.fileName = "";
            });
    },
});

export default publicationSlice.reducer;
