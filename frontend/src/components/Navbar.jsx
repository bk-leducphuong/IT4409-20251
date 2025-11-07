import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(2);

  const linkStyle = {
    textDecoration: "none",
    color: "black",
    cursor: "pointer",
    fontWeight: "500",
  };

  const iconButtonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    position: "relative",
    transition: "transform 0.2s ease, color 0.2s ease",
  };

  const badgeStyle = {
    position: "absolute",
    top: "2px",
    right: "2px",
    backgroundColor: "#DB4444",
    color: "white",
    borderRadius: "50%",
    fontSize: "0.7rem",
    fontWeight: "600",
    padding: "2px 6px",
    lineHeight: "1",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        borderBottom: "1px solid #ccc",
        width: "100%",
        backgroundColor: "white",
      }}
    >
      <nav
        style={{
          display: "flex",
          padding: "1.5rem 0",
          gap: "1rem",
          alignItems: "center",
          fontFamily: '"Nunito Sans", sans-serif',
          width: "90%",
          maxWidth: "1400px",
        }}
      >
        {/* ---- Brand ---- */}
        <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>Exclusive</div>

        {/* ---- Navigation Links ---- */}
        <div
          style={{
            flex: "1 1 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ul
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "clamp(300px, 35%, 450px)",
              margin: 0,
              padding: 0,
            }}
          >
            <li style={{ listStyleType: "none" }}>
              <Link to="/" style={linkStyle}>
                Home
              </Link>
            </li>
            <li style={{ listStyleType: "none" }}>
              <Link to="/contact" style={linkStyle}>
                Contact
              </Link>
            </li>
            <li style={{ listStyleType: "none" }}>
              <Link to="/about" style={linkStyle}>
                About
              </Link>
            </li>
            <li style={{ listStyleType: "none" }}>
              <Link to="/signin" style={{ ...linkStyle, color: "red", fontWeight: "bold" }}>
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* ---- Icons Section ---- */}
        <div
          style={{
            display: "flex",
            gap: "1.2rem",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => alert("Wishlist clicked!")}
            style={iconButtonStyle}
          >
            <i className="fa-regular fa-heart" style={{ fontSize: "1.5rem" }}></i>
            {wishlistCount > 0 && <span style={badgeStyle}>{wishlistCount}</span>}
          </button>

          <button
            onClick={() => alert("Cart clicked!")}
            style={iconButtonStyle}
          >
            <i className="fa-solid fa-cart-shopping" style={{ fontSize: "1.5rem" }}></i>
            {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
          </button>

          <button
            onClick={() => alert("Profile clicked!")}
            style={iconButtonStyle}
          >
            <i
              className="fa-solid fa-circle-user"
              style={{ fontSize: "1.5rem", color: "red" }}
            ></i>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
