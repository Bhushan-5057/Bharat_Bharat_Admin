import { getApiErrorMessage } from "@/lib/utils/apiError";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Blog, CreateBlogPayload, UpdateBlogPayload } from "@/types/blogTypes";
import { fetchAllBlogs, fetchBlogById, createBlog, updateBlog, deleteBlog, matchesBlogKey } from "@/store/api/blogsApi";

interface BlogState {
  items: Blog[];
  selected?: Blog | null;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};


export const getAllBlogs = createAsyncThunk(
  "blogs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllBlogs();
    } catch (err: unknown) {
      return rejectWithValue(getApiErrorMessage(err, "Failed to fetch blogs"));
    }
  }
);

export const getBlog = createAsyncThunk(
  "blogs/fetchById",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { items } = (getState() as { blogs: BlogState }).blogs;
      const cached = items.find((blog) => matchesBlogKey(blog, id)) ?? null;
      return await fetchBlogById(id, cached);
    } catch (err: unknown) {
      return rejectWithValue(getApiErrorMessage(err, "Failed to fetch blog"));
    }
  }
);

export const addBlog = createAsyncThunk(
  "blogs/create",
  async (payload: CreateBlogPayload, { rejectWithValue }) => {
    try {
      return await createBlog(payload);
    } catch (err: unknown) {
      return rejectWithValue(getApiErrorMessage(err, "Failed to create blog"));
    }
  }
);

export const editBlog = createAsyncThunk(
  "blogs/update",
  async (payload: UpdateBlogPayload, { rejectWithValue }) => {
    try {
      return await updateBlog(payload);
    } catch (err: unknown) {
      return rejectWithValue(getApiErrorMessage(err, "Failed to update blog"));
    }
  }
);

export const removeBlog = createAsyncThunk(
  "blogs/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteBlog(id);
      return id;
    } catch (err: unknown) {
      return rejectWithValue(getApiErrorMessage(err, "Failed to delete blog"));
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearSelectedBlog: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBlogs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => { state.loading = false; state.items = action.payload; })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = getApiErrorMessage(action.payload ?? action.error, "Failed to fetch blogs");
      })

      .addCase(getBlog.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getBlog.fulfilled, (state, action: PayloadAction<Blog>) => { state.loading = false; state.selected = action.payload; })
      .addCase(getBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = getApiErrorMessage(action.payload ?? action.error, "Failed to fetch blog");
      })

      .addCase(addBlog.fulfilled, (state, action: PayloadAction<Blog>) => { state.items.push(action.payload); })
      .addCase(editBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        const idx = state.items.findIndex(b => b.id === action.payload.id);
        if (idx > -1) state.items[idx] = action.payload;
      })
      .addCase(removeBlog.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(b => String(b.id) !== action.payload);
      });
  },
});

export const { clearSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;
