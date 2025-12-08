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
  const brands = useBrandStore((state) => state.data);

  const categories = useCategoryStore((state) => state.data);

  const getProducts = useProductStore((state) => state.getProducts);
  const [firstBrandItems, setFirstBrandItem] = useState(null);
  const [secondBrandItems, setSecondBrandItem] = useState(null);
  const [thirdBrandItems, setThirdBrandItem] = useState(null);
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [hover, setHover] = useState(false);

  const addItemToWishlist = useWishlistStore((state) => state.addItemToWishlist);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const result = await getProducts({ limit: 8, sort_by: 'newest' });
        const slides = (result.data?.products || [])
          .map((product) => ({
            image: product.variants?.[0]?.main_image_url,
            slug: product.slug,
            name: product.name,
          }))
          .filter((item) => item.image);

        if (slides.length) {
          setHeroSlides(slides.slice(0, 6)); // limit to 6 images
          setHeroIndex(0);
        }
      } catch (error) {
        console.error('Failed to load hero slides', error);
      }
    })();
  }, [getProducts]);

  useEffect(() => {
    if (heroSlides.length < 2) return;

    const id = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(id);
  }, [heroSlides]);

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

      {/* Header with categories in nav */}
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
        <div
          className={styles.heroSlider}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* Slides */}
          {heroSlides.length > 0 &&
            heroSlides.map((item, idx) => (
              <img
                key={item.slug || idx}
                className={`${styles.heroSlide} ${heroIndex === idx ? styles.activeSlide : ''}`}
                src={item.image}
                alt={item.name || 'product'}
                onClick={() => item.slug && navigate(`/product/${item.slug}`)}
              />
            ))}

          {/* Dots */}
          {heroSlides.length > 0 && (
            <div className={`${styles.heroDots} ${hover ? styles.showDots : ''}`}>
              {heroSlides.map((_, idx) => (
                <span
                  key={idx}
                  className={`${styles.dot} ${heroIndex === idx ? styles.activeDot : ''}`}
                  onClick={() => setHeroIndex(idx)}
                ></span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Brand shelves */}
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

      {/* Brands using CategoryCard */}
      <Shelf topic={'Brands'} strong={'Browse By Brand'} numberItems={brands?.length || 6}>
        {brands &&
          brands.map((brand) => (
            <CategoryCard
              key={brand._id}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/products?brand=${brand.name}`);
              }}
              name={brand.name}
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
            navigate('/viewallproduct');
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
