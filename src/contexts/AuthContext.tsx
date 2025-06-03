import { createContext, useContext, useState, ReactNode } from 'react';
import { useAppDispatch } from '../hooks/useStore';
import { fetchCart } from '../store/slice/cartSlice';
import { UserInforProps } from '../interfaces/user';

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  update: () => void;
  isAuthenticated: boolean;
  user: UserInforProps | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const API = process.env.REACT_APP_API_URL;
  const dispatch = useAppDispatch();

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [user, setUser] = useState<UserInforProps | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  });

  const update = async () => {
    try {
      const res = await fetch(`${API}/userinfor/${user?.id}`)
      const data = await res.json();
      const { shipping_infor, ...rest } = data;
      const loggedInUser: UserInforProps = {
        ...rest,
        shippingInfor: shipping_infor,
      };
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (err) {
      console.log(err)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API}/users?username=${username}&password=${password}`);
      const id = await res.json();

      if (res.ok && id.length > 0) {
        const res_data = await fetch(`${API}/userinfor/${id[0].id}`);
        const data = await res_data.json();

        if (data) {
          const { shipping_infor, ...rest } = data;

          const loggedInUser: UserInforProps = {
            ...rest,
            shippingInfor: shipping_infor,
          };
          const userToken = id[0].token || 'null';
          setToken(userToken);
          setUser(loggedInUser);
          dispatch(fetchCart(loggedInUser.id));

          localStorage.setItem('token', userToken);
          localStorage.setItem('user', JSON.stringify(loggedInUser));
        }
      } else {
        alert('Tài khoản hoặc mật khẩu không đúng');
      }
    } catch (err) {
      console.error('Login failed:', err);
      alert('Đã có lỗi xảy ra!');
    }
  };


  const logout = () => {
    setToken(null);
    setUser(null)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, update, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
