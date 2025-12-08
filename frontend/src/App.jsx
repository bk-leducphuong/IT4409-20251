import About from './sites/About/About';
import Admin from './sites/Admin/Admin';
import Login from './sites/Login/Login';
import Cart from './sites/Cart/Cart';
import CheckOut from './sites/CheckOut/CheckOut';
import Contact from './sites/Contact/Contact';
import Home from './sites/Home/Home';
import NotFoundPage from './sites/NotFound/NotFound';
import Product from './sites/Product/Product';
import Searching from './sites/Searching/Searching';
import User from './sites/User/User';
import WistList from './sites/WistList/WistList';
import UserSearch from './sites/UserSearch/UserSearch';

import Loading from './components/Loading/Loading';
import UserProtectedRoute from './components/UserProtectedRoute/UserProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute/AdminProtectedRoute';

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from './stores/userStore';
import { useBrandStore } from './stores/brandStore';
import { useCategoryStore } from './stores/categoryStore';

import Dev from './sites/Dev';

function App() {
  const [dev] = useState(false);

  useEffect(() => {
    if (!dev)
      (async () =>
        await Promise.allSettled([
          useUserStore.getState().loadUserData(),
          useBrandStore.getState().loadBrands(),
          useCategoryStore.getState().loadCategories(),
        ]))();
  }, []);

  if (dev)
    return (
      <BrowserRouter>
        <Dev></Dev>
      </BrowserRouter>
    );

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/search" element={<UserSearch />}></Route>
          <Route path="/product/:slug" element={<NotImplement />}></Route>
          <Route path="/products" element={<NotImplement />}></Route>
          <Route element={<UserProtectedRoute />}>
            <Route path="/cart" element={<Cart />}></Route>
            <Route path="/checkout" element={<CheckOut />}></Route>
            <Route path="/user" element={<User />}></Route>
            <Route path="/wistlist" element={<WistList />}></Route>
          </Route>
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<Admin />}></Route>
          </Route>
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
      </BrowserRouter>
      <Loading />
      <Toaster />
    </>
  );
}

export default App;
