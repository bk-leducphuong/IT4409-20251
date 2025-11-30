import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./sites/home/home.jsx";
import SignIn from "./sites/SignIn.jsx";
import ViewAllProducts from "./sites/home/ViewAllProducts.jsx";
import WU from "./assets/image9.jpg"; 

export default function App() {
  // GLOBAL product list for View All Products page
  const allProducts = [
    { id: 1, name: "Wireless Headphones", price: 99, oldPrice: 149, img: WU },
    { id: 2, name: "Smart Watch", price: 79, oldPrice: 129, img: WU },
    { id: 3, name: "Gaming Mouse", price: 59, oldPrice: 99, img: WU },
  ];

  // GLOBAL add-to-cart function
  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <Router>
      <Routes>
        {/* Pass handleAddToCart to Home */}
        <Route path="/" element={<Home handleAddToCart={handleAddToCart} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/contact"
          element={<div style={{ textAlign: "center", marginTop: "100px" }}>Contact Page</div>}
        />
        <Route
          path="/about"
          element={<div style={{ textAlign: "center", marginTop: "100px" }}>About Page</div>}
        />

        {/* View All Products Route */}
        <Route
          path="/all-products"
          element={
            <ViewAllProducts
              products={allProducts}
              handleAddToCart={handleAddToCart}
            />
          }
        />
      </Routes>
    </Router>
  );
}
