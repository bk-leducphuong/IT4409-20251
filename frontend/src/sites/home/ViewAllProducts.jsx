import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ViewAllProducts({ products, handleAddToCart }) {
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <div
        className={styles.headerSection}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "35px",
          padding: "0 100px",
          marginTop: "35px",
        }}
      >
        <div className={styles.flashSalesTitle}>
          <p className={styles.flashSalesLabel}>All Products</p>
          <h2 className={styles.sectionTitle}>All Products</h2>
        </div>
      </div>

      <div
        className={styles.productRow}
        style={{
          flexWrap: "wrap",
          overflowX: "visible",
          justifyContent: "center",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className={styles.productCard}
            onClick={() => handleViewDetails(p.id)}
            style={{ flex: "0 0 220px" }}
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

            <h4>{p.name}</h4>

            <div className={styles.price}>
              {p.oldPrice && <p className={styles.old}>${p.oldPrice}</p>}
              <p className={styles.new}>${p.price}</p>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
