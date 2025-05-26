import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/cartSlice";
import wishlistReducer from "./slice/wishlistSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
