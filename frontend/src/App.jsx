import About from './sites/About/About';
import Login from './sites/Login/Login';
import Cart from './sites/Cart/Cart';
import CheckOut from './sites/CheckOut/CheckOut';
import Contact from './sites/Contact/Contact';
import Loading from './components/Loading/Loading';
import NotImplement from './sites/NotImplement/NotImplement';
import NotFoundPage from './sites/NotFound/NotFound';
import WistList from './sites/WistList/WistList';

import UserProtectedRoute from './components/UserProtectedRoute/UserProtectedRoute';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUserStore } from './stores/userStore';
// import { useAuthStore } from './stores/authStore';
// import Dev from "./sites/Dev";
import { useEffect } from 'react';

function App() {
  //   return (
  //     <BrowserRouter>
  //       <Dev></Dev>
  //     </BrowserRouter>
  //   );

  useEffect(() => {
    try {
      useUserStore.getState().loadUserData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NotImplement />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route element={<UserProtectedRoute />}>
            <Route path="/cart" element={<Cart />}></Route>
            <Route path="/checkout" element={<CheckOut />}></Route>
            <Route path="/wistlist" element={<WistList />}></Route>
          </Route>
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
      </BrowserRouter>
      <Loading />
    </>
  );
}

export default App;
