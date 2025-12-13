import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useBrandStore } from '../../stores/brandStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { useProductStore } from '../../stores/productStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import styles from './Searching.module.css';

function Searching() {
  const location = useLocation();
  const [params] = useSearchParams();
  const [productName, setProductName] = useState(() => params.get('product') || '');
  const [brand, setBrand] = useState(() => params.get('brand') || '');
  const [category, setCategory] = useState(() => params.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [products, setProducts] = useState(null);
  const [totalPage, setTotalPage] = useState(1);
  const [refresh, setRefresh] = useState(true);

  const brands = useBrandStore((state) => state.data);
  const categories = useCategoryStore((state) => state.data);

  const getProducts = useProductStore((state) => state.getProducts);
  const addItemToWishlist = useWishlistStore((state) => state.addItemToWishlist);
  const navigate = useNavigate();

  const haveItem = products && products.length > 0;

  async function handleSearch() {
    try {
      const res = await getProducts({
        category,
        brand,
        search: productName,
        sort_by: sortBy,
        page,
        limit,
      });
      setProducts(res.data.products);
      setTotalPage(res.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setProductName(params.get('product') || '');
    setBrand(params.get('brand') || '');
    setCategory(params.get('category') || '');
    setRefresh((r) => !r);
  }, [location.search]);

  useEffect(() => {
    (async () => await handleSearch())();
  }, [page, limit, refresh]);

  return (
    <>
      <Navbar />

      <div className={styles.searching}>
        <div className={styles.input}>
          <div>
            <input
              type="text"
              placeholder="Enter product name:"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Lastest products</option>
              <option value="price_asc">Cheapest first</option>
              <option value="price_desc">Most expensive first</option>
            </select>
            <Button
              backgroundColor={'white'}
              onClick={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              Search
            </Button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter brand name:"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter category slug:"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {brands && (
            <>
              Brand:
              <div className={styles.list}>
                {brands.map((brand) => (
                  <button key={brand._id} onClick={() => setBrand(brand.name)}>
                    {brand.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {categories && (
            <>
              Category:
              <div className={styles.list}>
                {categories.map((category) => (
                  <button key={category._id} onClick={() => setCategory(category.slug)}>
                    {category.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.products}>
          {haveItem > 0 ? (
            products.map((product) => (
              <Card
                key={product._id}
                image={product.variants[0]?.main_image_url}
                newPrice={product.variants[0]?.price}
                productName={product.name}
                iconButtons={
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addItemToWishlist(product._id).catch((error) => {
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
                        navigate(`/product/${product.slug}`);
                      }}
                    >
                      <i className={`fa-regular fa-eye`}></i>
                    </button>
                  </>
                }
              />
            ))
          ) : (
            <div className={styles.notice}>
              <i className="fa-solid fa-magnifying-glass"></i> No product found
            </div>
          )}
        </div>

        {haveItem && (
          <div className={styles.pagination}>
            <div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage((p) => p - 1);
                }}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <span>
                Current page: {page}/{totalPage}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPage) setPage((p) => p + 1);
                }}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div>
              Product per page:
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={20}>20</option>
                <option value={40}>40</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Searching;
