import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup.string()
    .required('Tên đăng nhập là bắt buộc')
    .min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự'),
  password: yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

export default function Register() {
  const { t } = useTranslation();
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  const onSubmit = (data: { username: string; password: string; confirmPassword: string }) => {
    registerUser(data.username, data.password);
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: 'url(/login.jpg)' }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-[450px]">
        <h2 className="text-2xl font-semibold mb-4">{t('regis1')}</h2>

        <div className="mb-4">
          <label className="block mb-1">{t('auth1')}</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder={t('auth1')}
            {...register('username')}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">{t('auth2')}</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder={t('auth2')}
            {...register('password')}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">{t('regis2')}</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder={t('regis2')}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {t('regis5')}
        </button>

        <div className="text-right mt-[12px]">
          {t('regis3')} <Link to="/login" className="no-underline text-[var(--primary2-color)] hover:text-[var(--active-color)]">{t('regis4')}</Link>
        </div>
      </form>
    </div>
  );
}
