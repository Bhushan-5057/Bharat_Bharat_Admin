import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Appointment, fetchAppointments, markAppointmentAsViewed } from "@/store/api/appointmentApi";

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};


export const getAppointments = createAsyncThunk(
  "appointment/getAll",
  async () => {
    return await fetchAppointments();
  }
);

export const viewAppointment = createAsyncThunk(
  "appointment/viewOne",
  async (id: string) => {
    return await markAppointmentAsViewed(id);
  }
);


const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.appointments = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getAppointments.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch appointments";
      })
      .addCase(viewAppointment.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.appointments.findIndex((a) => a.id === updated.id);
        if (idx !== -1) {
          state.appointments[idx] = updated;
        }
      });
  },
});

export const { clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
