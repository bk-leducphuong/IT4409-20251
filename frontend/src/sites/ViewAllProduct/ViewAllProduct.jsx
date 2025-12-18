import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useProductStore } from '../../stores/productStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useCartStore } from '../../stores/cartStore';
import { useBrandStore } from '../../stores/brandStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './ViewAllProduct.module.css';

function ViewAllProduct() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [productName, setProductName] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(() => searchParams.get('brand') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const getProducts = useProductStore((state) => state.getProducts);
  const addItemToWishlist = useWishlistStore((state) => state.addItemToWishlist);
  const addItemToCart = useCartStore((state) => state.addItemToCart);
  const brands = useBrandStore((state) => state.data);
  const categories = useCategoryStore((state) => state.data);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const params = {
        limit: 100,
        sort_by: sortBy,
      };
      
      if (productName) params.search = productName;
      if (selectedBrand) params.brand = selectedBrand;
      if (selectedCategory) params.category = selectedCategory;

      const result = await getProducts(params);
      
      if (result.data.products) {
        let filtered = result.data.products;
        
        // Client-side price filtering
        if (priceMin !== '') {
          filtered = filtered.filter(p => p.variants?.[0]?.price >= parseFloat(priceMin));
        }
        if (priceMax !== '') {
          filtered = filtered.filter(p => p.variants?.[0]?.price <= parseFloat(priceMax));
        }
        
        setProducts(filtered);
        if (filtered.length === 0) {
          toast.error('No products found');
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [getProducts, searchParams]);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>All Products</h1>
          <p>{products.length} Products Found</p>
        </div>

        {/* Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.filterRow}>
            <input
              type="text"
              placeholder="Search product name..."
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className={styles.searchInput}
            />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.selectInput}
            >
              <option value="newest">Latest products</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <Button onClick={handleSearch}>
              <i className="fa-solid fa-search"></i> Search
            </Button>
          </div>

          <div className={styles.filterRow}>
            <input
              type="text"
              placeholder="Enter brand name..."
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className={styles.searchInput}
            />
            <input
              type="text"
              placeholder="Enter category..."
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.priceRow}>
            <input
              type="number"
              placeholder="Min price"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className={styles.priceInput}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max price"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className={styles.priceInput}
            />
          </div>

          {brands && brands.length > 0 && (
            <div className={styles.quickFilterSection}>
              <label>Brands:</label>
              <div className={styles.buttonList}>
                {brands.map((brand) => (
                  <button
                    key={brand._id}
                    onClick={() => setSelectedBrand(brand.name)}
                    className={selectedBrand === brand.name ? styles.active : ''}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {categories && categories.length > 0 && (
            <div className={styles.quickFilterSection}>
              <label>Categories:</label>
              <div className={styles.buttonList}>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={selectedCategory === category.slug ? styles.active : ''}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
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
                oldPrice={item.variants?.[0]?.original_price}
                onAddToCart={() => {
                  addItemToCart(item.variants?.[0]?._id, 1)
                    .then(() => toast.success('Item added to cart'))
                    .catch((error) => toast.error(error.message));
                }}
                iconButtons={
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addItemToWishlist(item._id)
                          .then(() => toast.success('Added to wishlist'))
                          .catch((error) => toast.error(error.message));
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
