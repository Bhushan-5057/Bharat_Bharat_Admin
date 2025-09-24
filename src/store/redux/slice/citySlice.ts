
import { createCity, deleteCity, deleteCitiesImage, fetchAllCities, fetchCityById, updateCity, updateCitiesImage } from "@/store/api/cityApi";
import { City, CityImage, CreateCityPayload, UpdateCityPayload } from "@/types/cityTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";


interface CityState {
    cities: City[];
    selectedCity: City | null;
    loading: boolean;
    error: string | null;
}

const initialState: CityState = {
    cities: [],
    selectedCity: null,
    loading: false,
    error: null,
};


export const fetchAllCitiesThunk = createAsyncThunk(
    "cities/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAllCities();
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch cities";
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchCityByIdThunk = createAsyncThunk(
    "cities/fetchById",
    async (id: string, { rejectWithValue }) => {
        try {
            return await fetchCityById(id);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch city";
            return rejectWithValue(errorMessage);
        }
    }
);

export const createCityThunk = createAsyncThunk(
    "cities/create",
    async (payload: CreateCityPayload, { rejectWithValue }) => {
        try {
            return await createCity(payload);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to create city";
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateCityThunk = createAsyncThunk(
    "cities/update",
    async ({ id, payload }: { id: string | number; payload: UpdateCityPayload }, { rejectWithValue }) => {
        try {
            return await updateCity(id, payload);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to update city";
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteCityThunk = createAsyncThunk(
    "cities/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteCity(id);
            return id;
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to delete city";
            return rejectWithValue(errorMessage);
        }
    }
);

export const editCitiesImageThunk = createAsyncThunk<
    CityImage,
    { id: string | number; is_main: boolean },
    { rejectValue: string }
>("cities/updateImage", async ({ id, is_main }, { rejectWithValue }) => {
    try {
        return await updateCitiesImage(id, { is_main });
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        return rejectWithValue(error.response?.data?.message || "Failed to update image");
    }
});


export const deleteCityImageThunk = createAsyncThunk<
    void,
    string | number,
    { rejectValue: string }
>("cities/deleteImage", async (id, { rejectWithValue }) => {
    try {
        await deleteCitiesImage(String(id));
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        return rejectWithValue(error.response?.data?.message || "Failed to delete image");
    }
});


const citySlice = createSlice({
    name: "cities",
    initialState,
    reducers: {
        clearSelectedCity: (state) => {
            state.selectedCity = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCitiesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCitiesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.cities = action.payload;
            })
            .addCase(fetchAllCitiesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCityByIdThunk.fulfilled, (state, action) => {
                state.selectedCity = action.payload;
            })
            .addCase(createCityThunk.fulfilled, (state, action) => {
                state.cities.push(action.payload);
            })
            .addCase(updateCityThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                state.cities = state.cities.map((s) =>
                    s.id === updated.id ? updated : s
                );
            })
            .addCase(deleteCityThunk.fulfilled, (state, action) => {
                state.cities = state.cities.filter((s) => s.id !== action.payload);
            })
            .addCase(deleteCityImageThunk.fulfilled, (state, action) => {
                if (state.selectedCity) {
                    state.selectedCity.images = state.selectedCity.images?.filter((img) => img.file_name !== action.payload);
                }
            })
            .addCase(editCitiesImageThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editCitiesImageThunk.fulfilled, (state, action) => {
                state.loading = false;

                if (state.selectedCity?.images) {
                    state.selectedCity.images = state.selectedCity.images.map((img) =>
                        img.id === action.payload.id
                            ? { ...img, is_main: action.payload.is_main }
                            : { ...img, is_main: false }
                    );
                }
            })
            .addCase(editCitiesImageThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update image";
            });
    },
});

export const { clearSelectedCity } = citySlice.actions;
export default citySlice.reducer;
