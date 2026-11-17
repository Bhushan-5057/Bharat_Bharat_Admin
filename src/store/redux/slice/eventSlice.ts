import { getApiErrorMessage } from "@/lib/utils/apiError";
import { createEvent, deleteEvent, deleteEventImage, fetchAllEvents, fetchEventById, updateEvent, updateEventImage } from "@/store/api/eventApi";
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
            return rejectWithValue(getApiErrorMessage(err, "Failed to fetch events"));
        }
    }
);

export const fetchEventByIdThunk = createAsyncThunk(
    "events/fetchById",
    async (id: string, { rejectWithValue }) => {
        try {
            return await fetchEventById(id);
        } catch (err: unknown) {
            return rejectWithValue(getApiErrorMessage(err, "Failed to fetch events"));
        }
    }
);

export const createEventThunk = createAsyncThunk(
    "events/create",
    async (payload: CreateEventPayload, { rejectWithValue }) => {
        try {
            return await createEvent(payload);
        } catch (err: unknown) {
            return rejectWithValue(getApiErrorMessage(err, "Failed to create event"));
        }
    }
);

export const updateEventThunk = createAsyncThunk(
    "events/update",
    async (payload: UpdateEventePayload, { rejectWithValue }) => {
        try {
            return await updateEvent(payload);
        } catch (err: unknown) {
            return rejectWithValue(getApiErrorMessage(err, "Failed to update event"));
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
            return rejectWithValue(getApiErrorMessage(err, "Failed to delete event"));
        }
    }
);

export const editEventImageThunk = createAsyncThunk<
    { id: string | number; is_main: boolean },
    { id: string | number; is_main: boolean },
    { rejectValue: string }
>("events/updateImage", async ({ id, is_main }, { rejectWithValue }) => {
    try {
        await updateEventImage(id, { is_main });
        return { id, is_main };
    } catch (err) {
        return rejectWithValue(getApiErrorMessage(err, "Failed to update image"));
    }
});

export const deleteEventImageThunk = createAsyncThunk<
    string | number,
    string | number,
    { rejectValue: string }
>("events/deleteImage", async (id, { rejectWithValue }) => {
    try {
        await deleteEventImage(id);
        return id;
    } catch (err) {
        return rejectWithValue(getApiErrorMessage(err, "Failed to delete image"));
    }
});


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
            .addCase(fetchEventByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEventByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedEvent = action.payload;
            })
            .addCase(fetchEventByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
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
            })
            .addCase(editEventImageThunk.fulfilled, (state, action) => {
                const payload = action.payload;
                const markMain = (images?: Event["images"]) =>
                    images?.map((img) => ({
                        ...img,
                        is_main: String(img.id) === String(payload.id),
                    }));

                if (state.selectedEvent?.images) {
                    const images = markMain(state.selectedEvent.images) || [];
                    state.selectedEvent.images = images;
                    state.selectedEvent.main_image =
                        images.find((img) => img.is_main) || null;
                }
                state.events = state.events.map((event) => {
                    if (String(event.id) !== String(state.selectedEvent?.id)) return event;
                    const images = markMain(event.images);
                    return {
                        ...event,
                        images,
                        main_image: images?.find((img) => img.is_main) || event.main_image,
                    };
                });
            })
            .addCase(deleteEventImageThunk.fulfilled, (state, action) => {
                const imageId = String(action.payload);
                if (state.selectedEvent?.images) {
                    state.selectedEvent.images = state.selectedEvent.images.filter(
                        (img) => String(img.id) !== imageId
                    );
                }
            });
    },
});

export const { clearSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;
