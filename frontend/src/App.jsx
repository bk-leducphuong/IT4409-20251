import Login from './sites/Login/Login';
import Cart from './sites/Cart/Cart';
import CheckOut from './sites/CheckOut/CheckOut';
import Contact from './sites/Contact/Contact';
import NotImplement from './sites/NotImplement/NotImplement';
import NotFoundPage from './sites/NotFound/NotFound';
import WistList from './sites/WistList/WistList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import useToken from './utils/useToken';
// import Dev from "./sites/Dev";

function App() {
  //   const [token, setToken] = useToken();

  //   return (
  //     <BrowserRouter>
  //       <Dev></Dev>
  //     </BrowserRouter>
  //   );

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NotImplement />}></Route>
          <Route path="/about" element={<NotImplement />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/checkout" element={<CheckOut />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/wistlist" element={<WistList />}></Route>
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
