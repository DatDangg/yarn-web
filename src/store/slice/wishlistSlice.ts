import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface WishlistState {
  items: number[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userId: number) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist?user_id=${userId}`);
    return res.data.map((item: any) => item.product_id);
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ userId, productId }: { userId: number; productId: number }) => {
    await axios.post(`${process.env.REACT_APP_API_URL}/wishlist`, {
      user_id: userId,
      product_id: productId,
    });
    return productId;
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ userId, productId }: { userId: number; productId: number }) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist?user_id=${userId}&product_id=${productId}`);
    await axios.delete(`${process.env.REACT_APP_API_URL}/wishlist/${res.data[0].id}`);
    return productId;
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: state => {
      state.items = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWishlist.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.items.includes(action.payload)) {
          state.items.push(action.payload);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(id => id !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
