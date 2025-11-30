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
  const brands = useBrandStore((state) => state.data);
  const loadBrands = useBrandStore((state) => state.loadBrands);

  const categories = useCategoryStore((state) => state.data);
  const loadCategories = useCategoryStore((state) => state.loadCategories);

  const getProducts = useProductStore((state) => state.getProducts);
  const [firstBrandItems, setFirstBrandItem] = useState(null);
  const [secondBrandItems, setSecondBrandItem] = useState(null);
  const [thirdBrandItems, setThirdBrandItem] = useState(null);

  const addItemToWishlist = useWishlistStore((state) => state.addItemToWishlist);

  const navigate = useNavigate();

  async function fetchBrand() {
    try {
      await loadBrands();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function fetchCategory() {
    try {
      await loadCategories();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    (async () => {
      await Promise.allSettled([fetchBrand(), fetchCategory()]);
    })();
  }, []);

  useEffect(() => {
    if (
      brands &&
      brands.length > 0 &&
      (firstBrandItems == null || secondBrandItems == null || thirdBrandItems == null)
    ) {
      (async () => {
        const [firstItems, secondItems, thirdItems] = await Promise.all([
          getProducts({ brand: brands[0].name }),
          getProducts({ brand: brands[1].name }),
          getProducts({ brand: brands[2].name }),
        ]);

        setFirstBrandItem(firstItems.data.products);
        setSecondBrandItem(secondItems.data.products);
        setThirdBrandItem(thirdItems.data.products);
      })();
    }
  }, [brands]);

  return (
    <>
      <Navbar />

      <header className={`${styles.container} ${styles.header}`}>
        <nav>
          <ul>
            {brands &&
              brands.map((brand) => (
                <li key={brand._id}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/products?brand=${brand.name}`);
                    }}
                  >
                    {brand.name}
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

      {firstBrandItems && (
        <Shelf topic={brands?.[0]?.name || "Today's"} strong={brands?.[0]?.name || 'Flash Sales'}>
          {firstBrandItems.map((item) => (
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

      {secondBrandItems && (
        <Shelf
          topic={brands?.[1]?.name || 'This Month'}
          strong={brands?.[1]?.name || 'Best Selling Products'}
        >
          {secondBrandItems.map((item) => (
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
        </Shelf>
      )}

      {thirdBrandItems && (
        <Shelf
          topic={brands?.[2]?.name || 'Our Products'}
          strong={brands?.[2]?.name || 'Explore Our Products'}
        >
          {thirdBrandItems.map((item) => (
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
