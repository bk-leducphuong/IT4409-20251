import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import phoneImage from "../assets/react.svg"; // replace with your real image later

export default function SignIn() {
  return (
    <>
      <Navbar />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 0",
          fontFamily: '"Nunito Sans", sans-serif',
          backgroundColor: "white",
        }}
      >
        {/* Left image section */}
        <div style={{ flex: "1 1 50%", display: "flex", justifyContent: "center" }}>
          <img
            src={phoneImage}
            alt="Shopping illustration"
            style={{ width: "70%", maxWidth: "500px", borderRadius: "10px" }}
          />
        </div>

        {/* Right form section */}
        <div
          style={{
            flex: "1 1 50%",
            padding: "0 4rem",
            maxWidth: "450px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            Login to your account
          </h2>
          <p style={{ color: "#666", marginBottom: "2rem" }}>Enter your details below</p>

          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <input
              type="text"
              placeholder="Email or Phone Number"
              style={inputStyle}
            />
            <input type="password" placeholder="Password" style={inputStyle} />

            <button type="submit" style={redButton}>
              Log In
            </button>

            <button type="button" style={googleButton}>
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google icon"
                style={{ width: "18px", marginRight: "8px" }}
              />
              Sign in with Google
            </button>

            <p style={{ textAlign: "center", marginTop: "10px" }}>
              Don’t have an account?{" "}
              <a
                href="/signup"
                style={{ color: "#DB4444", fontWeight: "500", textDecoration: "none" }}
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

// --- Styles ---
const inputStyle = {
  padding: "12px 14px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "15px",
  width: "100%",
};

const redButton = {
  padding: "12px",
  backgroundColor: "#DB4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
};

const googleButton = {
  padding: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  backgroundColor: "white",
};
