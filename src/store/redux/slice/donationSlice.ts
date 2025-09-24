import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllDonations,
  fetchDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  Donation,
} from "@/store/api/donationApi";

interface DonationState {
  donations: Donation[];
  donation: Donation | null;
  loading: boolean;
  error: string | null;
}

const initialState: DonationState = {
  donations: [],
  donation: null,
  loading: false,
  error: null,
};


export const getDonations = createAsyncThunk("donation/getAll", async () => {
  return await fetchAllDonations();
});


export const getDonationById = createAsyncThunk(
  "donation/getById",
  async (id: string) => {
    return await fetchDonationById(id);
  }
);


export const addDonation = createAsyncThunk(
  "donation/create",
  async (payload: FormData) => {
    return await createDonation(payload);
  }
);


export const editDonation = createAsyncThunk(
  "donation/update",
  async ({ id, payload }: { id: string; payload: FormData }) => {
    return await updateDonation(id, payload);
  }
);



export const removeDonation = createAsyncThunk(
  "donation/delete",
  async (id: string) => {
    return await deleteDonation(id);
  }
);

const donationSlice = createSlice({
  name: "donation",
  initialState,
  reducers: {
    clearDonationState: (state) => {
      state.donation = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDonations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload;
      })
      .addCase(getDonations.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch donations";
      })

      .addCase(addDonation.fulfilled, (state, action) => {
        state.donations.push(action.payload);
      })

      .addCase(editDonation.fulfilled, (state, action) => {
        state.donations = state.donations.map((d) =>
          d.id === action.payload.id ? action.payload : d
        );
      })

      .addCase(removeDonation.fulfilled, (state, action) => {
  state.donations = state.donations.filter(
    (d) => d.id !== action.meta.arg
  );
});
  },
});

export const { clearDonationState } = donationSlice.actions;
export default donationSlice.reducer;
