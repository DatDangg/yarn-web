// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Blog from './pages/Blog/Blog';
import Login from './pages/Login/Login';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ui/ScrollToTop';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
