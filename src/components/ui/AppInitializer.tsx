import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAppDispatch } from "../../hooks/useStore";
import { fetchCart } from "../../store/slice/cartSlice";

const AppInitializer = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [user?.id]);

  return null; 
};

export default AppInitializer;
