import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Nếu đã login thì chuyển hướng về trang chính
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(); // gọi hàm login giả lập
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4">Đăng nhập</h2>
        <div className="mb-4">
          <label className="block mb-1">Tài khoản</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="username"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Mật khẩu</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
