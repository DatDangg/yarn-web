import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation()
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div 
    className="flex flex-col items-center justify-center h-screen bg-no-repeat bg-cover bg-center"
    style={{backgroundImage: 'url(/login.jpg)'}}
    >
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-[400px]">
        <h2 className="text-2xl font-semibold mb-4">{t('login1')}</h2>
        <div className="mb-4">
          <label className="block mb-1">{t('auth1')}</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder={t('auth1')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">{t('auth2')}</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder={t('auth2')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {t('login4')}
        </button>
        <div className='text-right mt-[12px]'>{t('login2')} <Link to='/register' className='no-underline text-[var(--primary2-color)] hover:text-[var(--active-color)]'>{t('login3')}</Link></div>
      </form>
    </div>
  );
}
