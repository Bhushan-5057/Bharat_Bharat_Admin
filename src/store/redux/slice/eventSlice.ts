import { createEvent, deleteEvent, fetchAllEvents, fetchEventById, updateEvent } from "@/store/api/eventApi";
import { CreateEventPayload, Event, UpdateEventePayload } from "@/types/eventTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface EventState {
    events: Event[];
    selectedEvent: Event | null;
    loading: boolean;
    error: string | null;               
}

const initialState: EventState = {
    events: [],
    selectedEvent: null,
    loading: false,
    error: null,
};


export const fetchAllEventsThunk = createAsyncThunk(
    "events/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAllEvents();
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch events";
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchEventByIdThunk = createAsyncThunk(
    "events/fetchById",
    async (id: string, { rejectWithValue }) => {
        try {
            return await fetchEventById(id);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to fetch events";
            return rejectWithValue(errorMessage);
        }
    }
);

export const createEventThunk = createAsyncThunk(
    "events/create",
    async (payload: CreateEventPayload, { rejectWithValue }) => {
        try {
            return await createEvent(payload);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to create event";
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateEventThunk = createAsyncThunk(
    "events/update",
    async (payload: UpdateEventePayload, { rejectWithValue }) => {
        try {
            return await updateEvent(payload);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to update event";
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteEventThunk = createAsyncThunk(
    "events/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            await deleteEvent(id);
            return id;
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Failed to delete event";
            return rejectWithValue(errorMessage);
        }
    }
);


const eventSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        clearSelectedEvent: (state) => {
            state.selectedEvent = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllEventsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllEventsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchAllEventsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchEventByIdThunk.fulfilled, (state, action) => {
                state.selectedEvent = action.payload;
            })
            .addCase(createEventThunk.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            .addCase(updateEventThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                state.events = state.events.map((s) =>
                    s.id === updated.id ? updated : s
                );
            })
            .addCase(deleteEventThunk.fulfilled, (state, action) => {
                state.events = state.events.filter((s) => s.id !== action.payload);
            });
    },
});

export const { clearSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;
