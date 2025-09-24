import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Blog, CreateBlogPayload, UpdateBlogPayload } from "@/types/blogTypes";
import { fetchAllBlogs, fetchBlogById, createBlog, updateBlog, deleteBlog } from "@/store/api/blogsApi";

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


export const getAllBlogs = createAsyncThunk("blogs/fetchAll", async () => {
  return await fetchAllBlogs();
});

export const getBlog = createAsyncThunk("blogs/fetchById", async (id: string) => {
  return await fetchBlogById(id);
});

export const addBlog = createAsyncThunk("blogs/create", async (payload: CreateBlogPayload) => {
  return await createBlog(payload);
});

export const editBlog = createAsyncThunk("blogs/update", async (payload: UpdateBlogPayload) => {
  return await updateBlog(payload);
});

export const removeBlog = createAsyncThunk("blogs/delete", async (id: string) => {
  await deleteBlog(id);
  return id;
});

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
      .addCase(getAllBlogs.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? "Failed to fetch blogs"; })

      .addCase(getBlog.fulfilled, (state, action: PayloadAction<Blog>) => { state.selected = action.payload; })

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
