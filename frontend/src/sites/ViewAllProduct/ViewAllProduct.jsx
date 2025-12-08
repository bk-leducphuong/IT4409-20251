import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Card from '../../components/Card/Card';
import { useProductStore } from '../../stores/productStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ViewAllProduct.module.css';

function ViewAllProduct() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getProducts = useProductStore((state) => state.getProducts);
  const addItemToWishlist = useWishlistStore((state) => state.addItemToWishlist);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllProducts() {
      setIsLoading(true);
      try {
        const result = await getProducts({ limit: 100 });
        
        if (result.data.products) {
          setProducts(result.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllProducts();
  }, [getProducts]);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>All Products</h1>
          <p>Browse our complete collection</p>
        </div>

        {isLoading ? (
          <div className={styles.loadingMessage}>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.noProducts}>
            <i className="fa-solid fa-inbox"></i>
            <h2>No Products Available</h2>
            <p>Check back soon for new products!</p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {products.map((item) => (
              <Card
                key={item._id}
                productName={item.name}
                image={item.variants?.[0]?.main_image_url}
                newPrice={item.variants?.[0]?.price}
                iconButtons={
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addItemToWishlist(item._id).catch((error) => {
                          console.error(error);
                          alert(error);
                        });
                      }}
                    >
                      <i className={`fa-regular fa-heart`}></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/product/${item.slug}`);
                      }}
                    >
                      <i className={`fa-regular fa-eye`}></i>
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ViewAllProduct;
