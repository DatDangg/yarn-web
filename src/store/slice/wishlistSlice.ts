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
    async ({ userId, productId }: { userId: number, productId: number }, { dispatch }) => {
        await axios.post(`${process.env.REACT_APP_API_URL}/wishlist`, {
            user_id: userId,
            product_id: productId
        });
        dispatch(fetchWishlist(userId));
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async ({ userId, productId }: { userId: number, productId: number }, { dispatch }) => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist?product_id=${productId}&user_id=${userId}`);
        await axios.delete(`${process.env.REACT_APP_API_URL}/wishlist/${res.data[0].id}`);
        dispatch(fetchWishlist(userId));
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {},
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
                state.error = action.error.message || 'Something went wrong';
            });
    }
});

export default wishlistSlice.reducer;
