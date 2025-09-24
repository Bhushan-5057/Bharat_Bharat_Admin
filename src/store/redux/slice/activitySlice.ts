import { createActivity, deleteActivity, fetchActivityById, fetchAllActivities, updateActivity } from "@/store/api/activityApi";
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
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch Activities";
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchActivityByIdThunk = createAsyncThunk(
    "activities/fetchById",
    async (id: string, { rejectWithValue }) => {
        try {
            return await fetchActivityById(id);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch activity";
            return rejectWithValue(errorMessage);
        }
    }
);

export const createActivityThunk = createAsyncThunk(
    "activities/create",
    async (payload: CreateActivityPayload, { rejectWithValue }) => {
        try {
            return await createActivity(payload);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to create activity";
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateActivityThunk = createAsyncThunk(
    "activities/update",
    async (payload: UpdateActivityPayload, { rejectWithValue }) => {
        try {
            return await updateActivity(payload);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to update activity";
            return rejectWithValue(errorMessage);
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
            const errorMessage =
                err instanceof Error ? err.message : "Failed to delete activity";
            return rejectWithValue(errorMessage);
        }
    }
);


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
            .addCase(fetchActivityByIdThunk.fulfilled, (state, action) => {
                state.selectedActivity = action.payload;
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
            });
    },
});

export const { clearSelectedActivity } = activitySlice.actions;
export default activitySlice.reducer;
