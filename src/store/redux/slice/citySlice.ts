import axios from "axios";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { createCity, deleteCity, deleteCitiesImage, fetchAllCities, fetchCityById, updateCity, updateCitiesImage } from "@/store/api/cityApi";
import { City, CityImage, CreateCityPayload, UpdateCityPayload } from "@/types/cityTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const rejectApiError = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err) && err.response?.data) {
        return err.response.data;
    }
    return getApiErrorMessage(err, fallback);
};


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
            return rejectWithValue(getApiErrorMessage(err, "Failed to fetch cities"));
        }
    }
);

export const fetchCityByIdThunk = createAsyncThunk(
    "cities/fetchById",
    async (id: string, { rejectWithValue }) => {
        try {
            return await fetchCityById(id);
        } catch (err: unknown) {
            return rejectWithValue(getApiErrorMessage(err, "Failed to fetch city"));
        }
    }
);

export const createCityThunk = createAsyncThunk(
    "cities/create",
    async (payload: CreateCityPayload, { rejectWithValue }) => {
        try {
            return await createCity(payload);
        } catch (err: unknown) {
            return rejectWithValue(rejectApiError(err, "Failed to create city"));
        }
    }
);

export const updateCityThunk = createAsyncThunk(
    "cities/update",
    async ({ id, payload }: { id: string | number; payload: UpdateCityPayload }, { rejectWithValue }) => {
        try {
            return await updateCity(id, payload);
        } catch (err: unknown) {
            return rejectWithValue(rejectApiError(err, "Failed to update city"));
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
            return rejectWithValue(getApiErrorMessage(err, "Failed to delete city"));
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
        return rejectWithValue(getApiErrorMessage(err, "Failed to update image"));
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
        return rejectWithValue(getApiErrorMessage(err, "Failed to delete image"));
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
            .addCase(fetchCityByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCityByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCity = action.payload;
            })
            .addCase(fetchCityByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = getApiErrorMessage(action.payload, "Failed to fetch city");
            })
            .addCase(createCityThunk.fulfilled, (state, action) => {
                if (action.payload?.id) {
                    state.cities.push(action.payload);
                }
            })
            .addCase(updateCityThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                if (!updated?.id) return;
                state.cities = state.cities.map((s) =>
                    String(s.id) === String(updated.id) ? { ...s, ...updated } : s
                );
                if (state.selectedCity && String(state.selectedCity.id) === String(updated.id)) {
                    state.selectedCity = { ...state.selectedCity, ...updated };
                }
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
