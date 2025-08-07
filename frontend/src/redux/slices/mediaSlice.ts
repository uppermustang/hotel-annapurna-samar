import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface MediaItem {
  _id: string;
  filename: string;
  path: string;
  originalName: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
  description?: string;
  category: string;
}

interface MediaState {
  items: MediaItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MediaState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchMedia = createAsyncThunk(
  "media/fetchMedia",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/media");
      if (!response.ok) {
        throw new Error("Failed to fetch media");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const uploadMedia = createAsyncThunk(
  "media/uploadMedia",
  async (files: FormData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: files,
      });
      if (!response.ok) {
        throw new Error("Failed to upload media");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

export const deleteMedia = createAsyncThunk(
  "media/deleteMedia",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete media");
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch media
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedia.fulfilled, (state, action: PayloadAction<MediaItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Upload media
      .addCase(uploadMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadMedia.fulfilled, (state, action: PayloadAction<MediaItem[]>) => {
        state.loading = false;
        state.items = [...action.payload, ...state.items];
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete media
      .addCase(deleteMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedia.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = mediaSlice.actions;
export default mediaSlice.reducer;
