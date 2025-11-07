import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./sites/home/home.jsx";
import SignIn from "./sites/SignIn";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/contact" element={<div style={{ textAlign: "center", marginTop: "100px" }}>Contact Page</div>} />
        <Route path="/about" element={<div style={{ textAlign: "center", marginTop: "100px" }}>About Page</div>} />
      </Routes>
    </Router>
  );
}
