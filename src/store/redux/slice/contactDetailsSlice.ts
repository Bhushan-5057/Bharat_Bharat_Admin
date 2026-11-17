import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ContactDetails,
  ContactDetailsPayload,
  createContactDetails,
  deleteContactDetails,
  fetchAllContactDetails,
  fetchContactDetailsById,
  updateContactDetails,
} from "@/store/api/contactDetailsApi";

interface ContactDetailsState {
  items: ContactDetails[];
  item: ContactDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactDetailsState = {
  items: [],
  item: null,
  loading: false,
  error: null,
};

export const getContactDetailsList = createAsyncThunk(
  "contactDetails/getAll",
  async () => fetchAllContactDetails()
);

export const getContactDetailsById = createAsyncThunk(
  "contactDetails/getById",
  async (id: string) => fetchContactDetailsById(id)
);

export const addContactDetails = createAsyncThunk(
  "contactDetails/create",
  async (payload: ContactDetailsPayload) => createContactDetails(payload)
);

export const editContactDetails = createAsyncThunk(
  "contactDetails/update",
  async ({ id, payload }: { id: string; payload: ContactDetailsPayload }) =>
    updateContactDetails(id, payload)
);

export const removeContactDetails = createAsyncThunk(
  "contactDetails/delete",
  async (id: string) => deleteContactDetails(id)
);

const contactDetailsSlice = createSlice({
  name: "contactDetails",
  initialState,
  reducers: {
    clearContactDetailsState: (state) => {
      state.item = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContactDetailsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContactDetailsList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getContactDetailsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load contact details";
      })
      .addCase(getContactDetailsById.fulfilled, (state, action) => {
        state.item = action.payload;
      })
      .addCase(addContactDetails.fulfilled, (state, action) => {
        const created = action.payload?.contactDetails || action.payload;
        if (created?.id) state.items = [created, ...state.items];
      })
      .addCase(editContactDetails.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items = state.items.map((item) =>
          String(item.id) === String(updated.id) ? updated : item
        );
        state.item = updated;
      })
      .addCase(removeContactDetails.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => String(item.id) !== String(action.payload.id)
        );
      });
  },
});

export const { clearContactDetailsState } = contactDetailsSlice.actions;
export default contactDetailsSlice.reducer;
