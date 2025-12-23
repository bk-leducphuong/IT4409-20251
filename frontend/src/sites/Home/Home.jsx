import Navbar from '../../components/Navbar/Navbar';
import Shelf from '../../components/Shelf/Shelf';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Services from '../../components/Services/Services';
import Footer from '../../components/Footer/Footer';
import { useBrandStore } from '../../stores/brandStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { useProductStore } from '../../stores/productStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './Home.module.css';

function CategoryCard({ icon, image, name, onClick = () => console.log('button clicked') }) {
  return (
    <button onClick={onClick} className={styles.categoryCard}>
      <div>
        {icon}
        {!icon && image && <img src={image} alt="decoration" />}
      </div>
      <div>{name}</div>
    </button>
  );
}

function Home() {
  const categories = useCategoryStore((state) => state.data);

  const getProducts = useProductStore((state) => state.getProducts);
  const getTrendingProducts = useProductStore((state) => state.getTrendingProducts);
  const [trendingProducts, setTrendingProducts] = useState(null);

  const [firstCategoryItems, setFirstBrandItem] = useState(null);
  const [secondCategoryItems, setSecondBrandItem] = useState(null);
  const [thirdCategoryItems, setThirdBrandItem] = useState(null);

  const addItemToWishlist = useWishlistStore((state) => state.addItemToWishlist);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      categories &&
      categories.length > 0 &&
      (firstCategoryItems == null || secondCategoryItems == null || thirdCategoryItems == null)
    ) {
      (async () => {
        const [firstItems, secondItems, thirdItems, trendingProducts] = await Promise.all([
          getProducts({ category: categories[0].slug }),
          getProducts({ category: categories[1].slug }),
          getProducts({ category: categories[2].slug }),
          getTrendingProducts(),
        ]);
        setTrendingProducts(trendingProducts.data.products);
        setFirstBrandItem(firstItems.data.products);
        setSecondBrandItem(secondItems.data.products);
        setThirdBrandItem(thirdItems.data.products);
      })();
    }
  }, [categories]);

  return (
    <>
      <Navbar />

      <header className={`${styles.container} ${styles.header}`}>
        <nav>
          <ul>
            {categories &&
              categories.map((category) => (
                <li key={category._id}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/products?category=${category.slug}`);
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
          </ul>
        </nav>

        <div>
          <img
            src="https://9to5mac.com/wp-content/uploads/sites/6/2024/05/iphone-17.jpg"
            alt="decoration"
          />
        </div>
      </header>

      {trendingProducts && (
        <Shelf topic={'Trending Products'} strong={'In one place'}>
          {trendingProducts.map((item) => (
            <Card
              key={item.product_id}
              productName={item.product_name}
              image={item.main_image_url}
              iconButtons={
                <button onClick={() => navigate(`/product/${item.product_slug}`)}>
                  <i className={`fa-regular fa-eye`}></i>
                </button>
              }
            />
          ))}
        </Shelf>
      )}

      {firstCategoryItems && firstCategoryItems.length > 0 && (
        <Shelf
          topic={categories?.[0]?.name || "Today's"}
          strong={categories?.[0]?.name || 'Flash Sales'}
        >
          {firstCategoryItems.map((item) => (
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
                      addItemToWishlist(item._id)
                        .then(() => toast.success('Item added to wishlist'))
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
        </Shelf>
      )}

      <Shelf topic={'Categories'} strong={'Browse By Category'} numberItems={6}>
        {categories &&
          categories.map((category) => (
            <CategoryCard
              key={category._id}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/products?category=${category.slug}`);
              }}
              name={category.name}
            />
          ))}
      </Shelf>

      {secondCategoryItems && secondCategoryItems.length > 0 && (
        <Shelf
          topic={categories?.[1]?.name || 'This Month'}
          strong={categories?.[1]?.name || 'Best Selling Products'}
        >
          {secondCategoryItems.map((item) => (
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
                      addItemToWishlist(item._id)
                        .then(() => toast.success('Item added to wishlist'))
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
        </Shelf>
      )}

      {thirdCategoryItems && thirdCategoryItems.length > 0 && (
        <Shelf
          topic={categories?.[2]?.name || 'Our Products'}
          strong={categories?.[2]?.name || 'Explore Our Products'}
        >
          {thirdCategoryItems.map((item) => (
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
                      addItemToWishlist(item._id)
                        .then(() => toast.success('Item added to wishlist'))
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
        </Shelf>
      )}

      <div className={styles.viewAll}>
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate('/products');
          }}
        >
          View All Products
        </Button>
      </div>

      <Services />

      <button
        className={styles.toTop}
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>

      <Footer />
    </>
  );
}

export default Home;
