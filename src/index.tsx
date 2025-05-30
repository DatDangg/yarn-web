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
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastContainer } from 'react-toastify';
import Cart from './pages/Cart/Cart';
import AppInitializer from './components/ui/AppInitializer';
import WishList from './pages/WishList/WishList';
import ProductList from './pages/ProductList/ProductList';
import BlogDetail from './pages/Blog/BlogDetail';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover={false}
            draggable
            className="text-[20px]" />
          <ScrollToTop />
          <AppInitializer />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<WishList />} />
              <Route path="/product" element={<ProductList />} />
              <Route path="/blog/:name" element={<BlogDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  // </React.StrictMode>
);

reportWebVitals();
