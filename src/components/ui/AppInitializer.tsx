import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { fetchCart } from "../../store/slice/cartSlice";
import { fetchWishlist } from "../../store/slice/wishlistSlice";

const AppInitializer = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(state => state.cart.items);
  const wishlistItems = useAppSelector(state => state.wishlist.items);

  useEffect(() => {
    if (user?.id) {
      if (cartItems.length === 0) {
        dispatch(fetchCart(user.id));
      }
      if (wishlistItems.length === 0) {
        dispatch(fetchWishlist(user.id));
      }
    }
  }, [user?.id, cartItems.length, wishlistItems.length, dispatch]);

  return null;
};

export default AppInitializer;
