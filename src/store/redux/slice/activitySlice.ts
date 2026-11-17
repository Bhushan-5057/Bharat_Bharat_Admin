import { getApiErrorMessage } from "@/lib/utils/apiError";
import { createActivity, deleteActivity, deleteActivityImage, fetchActivityById, fetchAllActivities, updateActivity, updateActivityImage } from "@/store/api/activityApi";
import { Activity, CreateActivityPayload, UpdateActivityPayload } from "@/types/activityTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface ActivityState {
    activities: Activity[];
    selectedActivity: Activity | null;
    loading: boolean;
    error: string | null;               
}

const initialState: ActivityState = {
    activities: [],
    selectedActivity: null,
    loading: false,
    error: null,
};


export const fetchAllActivitiesThunk = createAsyncThunk(
    "activities/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAllActivities();
        } catch (err: unknown) {
            return rejectWithValue(getApiErrorMessage(err, "Failed to fetch Activities"));
        }
    }
);

export const fetchActivityByIdThunk = createAsyncThunk(
    "activities/fetchById",
    async (id: string, { rejectWithValue }) => {
        try {
            return await fetchActivityById(id);
        } catch (err: unknown) {
            return rejectWithValue(getApiErrorMessage(err, "Failed to fetch activity"));
        }
    }
);

export const createActivityThunk = createAsyncThunk(
    "activities/create",
    async (payload: CreateActivityPayload, { rejectWithValue }) => {
        try {
            return await createActivity(payload);
        } catch (err: unknown) {
            return rejectWithValue(getApiErrorMessage(err, "Failed to create activity"));
        }
    }
);

export const updateActivityThunk = createAsyncThunk(
    "activities/update",
    async (payload: UpdateActivityPayload, { rejectWithValue }) => {
        try {
            return await updateActivity(payload);
        } catch (err: unknown) {
            return rejectWithValue(getApiErrorMessage(err, "Failed to update activity"));
        }
    }
);

export const deleteActivityThunk = createAsyncThunk(
    "activities/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteActivity(id);
            return id;
        } catch (err: unknown) {
            return rejectWithValue(getApiErrorMessage(err, "Failed to delete activity"));
        }
    }
);

export const editActivityImageThunk = createAsyncThunk<
    { id: string | number; is_main: boolean },
    { id: string | number; is_main: boolean },
    { rejectValue: string }
>("activities/updateImage", async ({ id, is_main }, { rejectWithValue }) => {
    try {
        await updateActivityImage(id, { is_main });
        return { id, is_main };
    } catch (err) {
        return rejectWithValue(getApiErrorMessage(err, "Failed to update image"));
    }
});

export const deleteActivityImageThunk = createAsyncThunk<
    string | number,
    string | number,
    { rejectValue: string }
>("activities/deleteImage", async (id, { rejectWithValue }) => {
    try {
        await deleteActivityImage(id);
        return id;
    } catch (err) {
        return rejectWithValue(getApiErrorMessage(err, "Failed to delete image"));
    }
});


const activitySlice = createSlice({
    name: "activities",
    initialState,
    reducers: {
        clearSelectedActivity: (state) => {
            state.selectedActivity = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllActivitiesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllActivitiesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.activities = action.payload;
            })
            .addCase(fetchAllActivitiesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchActivityByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivityByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedActivity = action.payload;
            })
            .addCase(fetchActivityByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createActivityThunk.fulfilled, (state, action) => {
                state.activities.push(action.payload);
            })
            .addCase(updateActivityThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                state.activities = state.activities.map((s) =>
                    s.id === updated.id ? updated : s
                );
            })
            .addCase(deleteActivityThunk.fulfilled, (state, action) => {
                state.activities = state.activities.filter((s) => s.id !== action.payload);
            })
            .addCase(editActivityImageThunk.fulfilled, (state, action) => {
                const payload = action.payload;
                const markMain = (images?: Activity["images"]) =>
                    images?.map((img) => ({
                        ...img,
                        is_main: String(img.id) === String(payload.id),
                    }));

                if (state.selectedActivity?.images) {
                    const images = markMain(state.selectedActivity.images) || [];
                    state.selectedActivity.images = images;
                    state.selectedActivity.main_image =
                        images.find((img) => img.is_main) || null;
                }
                state.activities = state.activities.map((activity) => {
                    if (String(activity.id) !== String(state.selectedActivity?.id)) return activity;
                    const images = markMain(activity.images);
                    return {
                        ...activity,
                        images,
                        main_image: images?.find((img) => img.is_main) || activity.main_image,
                    };
                });
            })
            .addCase(deleteActivityImageThunk.fulfilled, (state, action) => {
                const imageId = String(action.payload);
                if (state.selectedActivity?.images) {
                    state.selectedActivity.images = state.selectedActivity.images.filter(
                        (img) => String(img.id) !== imageId
                    );
                }
            });
    },
});

export const { clearSelectedActivity } = activitySlice.actions;
export default activitySlice.reducer;
