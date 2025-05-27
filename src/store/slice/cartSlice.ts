import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export interface CartItem {
  id?: number; // ID sẽ do server tự tạo khi thêm mới
  product_id: number;
  quantity: number;
  user_id: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Lấy danh sách giỏ hàng từ server theo user_id
export const fetchCart = createAsyncThunk<CartItem[], number>(
  "cart/fetchCart",
  async (userId) => {
    const res = await axios.get(`${API}/cart?user_id=${userId}`);
    return res.data as CartItem[];
  }
);

// Update quantity on server
export const updateQuantity = createAsyncThunk<
  CartItem,
  { id: number; quantity: number }
>("cart/updateQuantity", async ({ id, quantity }) => {
  const res = await axios.patch(`${API}/cart/${id}`, { quantity });
  return res.data;
});

// Remove item from server
export const removeFromCart = createAsyncThunk<number, number>(
  "cart/removeFromCart",
  async (id) => {
    await axios.delete(`${API}/cart/${id}`);
    return id;
  }
);

export const addToCartServer = createAsyncThunk<
  CartItem, // Return type
  { user_id: number; product_id: number; quantity?: number }, // Payload type
  { rejectValue: string } // Error payload
>(
  "cart/addToCartServer",
  async ({ user_id, product_id, quantity = 1 }, { rejectWithValue }) => {
    try {
      const [cartRes, productRes] = await Promise.all([
        axios.get(`${API}/cart`),
        axios.get(`${API}/product/${product_id}`),
      ]);

      const existing = cartRes.data.find(
        (item: CartItem) => item.product_id === product_id && item.user_id === user_id
      );

      const stock = productRes.data.stock;

      if (quantity <= 0) {
        return rejectWithValue("Số lượng không hợp lệ");
      }

      if (existing) {
        const newQuantity = existing.quantity + quantity;

        if (newQuantity > stock) {
          return rejectWithValue("Vượt quá số lượng tồn kho");
        }

        const updated = await axios.patch(`${API}/cart/${existing.id}`, {
          quantity: newQuantity,
        });

        return updated.data;
      } else {
        const created = await axios.post(`${API}/cart`, {
          user_id,
          product_id,
          quantity,
        });

        return created.data;
      }
    } catch (error) {
      return rejectWithValue("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  }
);


export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increaseQuantity: (state, action: PayloadAction<{ product_id: number; user_id: number }>) => {
      const item = state.items.find(
        i => i.product_id === action.payload.product_id && i.user_id === action.payload.user_id
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<{ product_id: number; user_id: number }>) => {
      const item = state.items.find(
        i => i.product_id === action.payload.product_id && i.user_id === action.payload.user_id
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(updateQuantity.fulfilled, (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    });

    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
    builder.addCase(addToCartServer.fulfilled, (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity = action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    });

  },
});

export const { increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
