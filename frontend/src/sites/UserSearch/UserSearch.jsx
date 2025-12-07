import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Card from '../../components/Card/Card';
import { useProductStore } from '../../stores/productStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './UserSearch.module.css';

function UserSearch() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  const getProducts = useProductStore((state) => state.getProducts);
  const addItemToWishlist = useWishlistStore((state) => state.addItemToWishlist);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSearchResults() {
      setIsLoading(true);
      setNoResults(false);
      try {
        if (searchQuery.trim() === '') {
          setProducts([]);
          setNoResults(true);
          setIsLoading(false);
          return;
        }

        const result = await getProducts({ search: searchQuery });
        
        if (result.data.products && result.data.products.length > 0) {
          setProducts(result.data.products);
          setNoResults(false);
        } else {
          setProducts([]);
          setNoResults(true);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setProducts([]);
        setNoResults(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (searchQuery) {
      fetchSearchResults();
    } else {
      setIsLoading(false);
      setNoResults(true);
    }
  }, [searchQuery, getProducts]);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Search Results</h1>
          <p className={styles.searchQuery}>
            {searchQuery ? `Search results for: "${searchQuery}"` : 'Enter a search term'}
          </p>
        </div>

        {isLoading ? (
          <div className={styles.loadingMessage}>
            <p>Loading products...</p>
          </div>
        ) : noResults ? (
          <div className={styles.noProducts}>
            <i className="fa-solid fa-inbox"></i>
            <h2>No Products Found</h2>
            <p>Sorry, we couldn't find any products matching "{searchQuery}"</p>
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

export default UserSearch;
