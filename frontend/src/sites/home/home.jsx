import React, { useRef, useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import WU from "../../assets/image9.jpg";

export default function Home() {
  const flashSaleProducts = [
    { id: 1, name: "Wireless Headphones", price: 99, oldPrice: 149, img: WU },
    { id: 2, name: "Smart Watch", price: 79, oldPrice: 129, img: WU },
    { id: 3, name: "Gaming Mouse", price: 59, oldPrice: 99, img: WU },
    { id: 4, name: "Mechanical Keyboard", price: 89, oldPrice: 139, img: WU },
    { id: 5, name: "VR Headset", price: 199, oldPrice: 249, img: WU },
    { id: 6, name: "Smart Glasses", price: 159, oldPrice: 199, img: WU },
  ];

  const categories = [
    { id: 1, name: "Phones", img: WU },
    { id: 2, name: "Computers", img: WU },
    { id: 3, name: "SmartWatch", img: WU },
    { id: 4, name: "Camera", img: WU },
    { id: 5, name: "Headphones", img: WU },
    { id: 6, name: "Gaming", img: WU },
  ];

  const bestSelling = [
    { id: 1, name: "iPhone 14 Pro", price: 999, img: WU },
    { id: 2, name: "MacBook Air M3", price: 1199, img: WU },
    { id: 3, name: "iPad Pro", price: 799, img: WU },
    { id: 4, name: "AirPods Pro", price: 249, img: WU },
  ];

  const flashScrollRef = useRef(null);
  const navigate = useNavigate();

  // ---------- Scroll Buttons ----------
  const scrollLeft = () => flashScrollRef.current.scrollBy({ left: -240, behavior: "smooth" });
  const scrollRight = () => flashScrollRef.current.scrollBy({ left: 240, behavior: "smooth" });

  // ---------- Countdown Timer ----------
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          seconds = 59;
          minutes--;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ---------- Logic for Buttons ----------
  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className={styles.homeContainer}>
      <Navbar />

      {/* ---------- Hero Section ---------- */}
      <section className={styles.heroSection}>
        <div>
          <h1>iPhone 14 Pro</h1>
          <p>
            Experience the future of smartphones with the all-new iPhone 14 Pro.
            Powered by the A17 Bionic chip.
          </p>
          <button>Shop Now</button>
        </div>
        <img src={WU} alt="iPhone Banner" />
      </section>

      {/* ---------- Flash Sales Section ---------- */}
      <section className={styles.flashSales}>
        <div className={styles.flashSalesHeader}>
          <div className={styles.flashSalesTitle}>
            <p className={styles.flashSalesLabel}>Today's</p>
            <h2 className={styles.sectionTitle}>Flash Sales</h2>
          </div>

          <div className={styles.countdown}>
            <div>
              <span>Days</span>
              <p>{timeLeft.days.toString().padStart(2, "0")}</p>
            </div>
            <div>
              <span>Hours</span>
              <p>{timeLeft.hours.toString().padStart(2, "0")}</p>
            </div>
            <div>
              <span>Minutes</span>
              <p>{timeLeft.minutes.toString().padStart(2, "0")}</p>
            </div>
            <div>
              <span>Seconds</span>
              <p>{timeLeft.seconds.toString().padStart(2, "0")}</p>
            </div>
          </div>

          <div className={styles.arrowButtons}>
            <button onClick={scrollLeft}>‹</button>
            <button onClick={scrollRight}>›</button>
          </div>
        </div>

        <div ref={flashScrollRef} className={styles.productRow}>
          {flashSaleProducts.map((p) => (
            <div
              key={p.id}
              className={styles.productCard}
              onClick={() => handleViewDetails(p.id)} // whole card clickable
            >
              <div className={styles.imgContainer}>
                <img src={p.img} alt={p.name} />

                <button
                  className={styles.hoverCart}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    handleAddToCart(p);
                  }}
                >
                  Add to Cart
                </button>
              </div>
              <h4>{p.name}</h4>
              <div className={styles.price}>
                <p className={styles.old}>${p.oldPrice}</p>
                <p className={styles.new}>${p.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.viewAll}>
          <button>View All Products</button>
        </div>
      </section>

      {/* ---------- Browse by Category ---------- */}
      <section className={styles.categories}>
        <p className={styles.Categorylabel}>Category</p>
        <h2 className={styles.sectionTitle}>Browse by Category</h2>
        <div className={styles.categoriesGrid}>
          {categories.map((cat) => (
            <div key={cat.id} className={styles.categoryCard}>
              <img src={cat.img} alt={cat.name} />
              <p>
                <b>{cat.name}</b>
              </p>
            </div>
          ))}
        </div>
      </section>

                {/* ---------- Best Selling Section ---------- */}
      <section className={styles.bestSelling}>
        <p className={styles.Bsellinglabel}>this month's</p>
        <h2 className={styles.sectionTitle}>Best Selling</h2>
        <div className={styles.bestSellingGrid}>
          {bestSelling.map((p) => (
            <div
              key={p.id}
              className={styles.bestSellingCard}
              onClick={() => handleViewDetails(p.id)}
            >
              <div className={styles.imgContainer}>
                <img src={p.img} alt={p.name} />
                <button
                  className={styles.hoverCart}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(p);
                  }}
                >
                  Add to Cart
                </button>
              </div>

              {/* Product Info */}
              <h4>{p.name}</h4>
              <p style={{ fontWeight: "bold", color: "red" }}>${p.price}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
