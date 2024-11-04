/* // src/redux/slices/brandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks for asynchronous actions
export const fetchBrands = createAsyncThunk('brands/fetchBrands', async () => {
  const response = await axios.get('http://localhost:4000/api/brands/all');
  return response.data.brands;
});

export const deleteBrand = createAsyncThunk('brands/deleteBrand', async (brandSlug, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`http://localhost:4000/api/brands/${brandSlug}`);
    return { brandSlug, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response.data.error || 'Error deleting brand');
  }
});

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    message: null,
  },
  reducers: {
    clearMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.items = state.items.filter((brand) => brand.slug !== action.payload.brandSlug);
        state.message = action.payload.message;
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = brandSlice.actions;
export default brandSlice.reducer;
 */