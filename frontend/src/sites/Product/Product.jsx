import Navbar from '../../components/Navbar/Navbar';
import Shelf from '../../components/Shelf/Shelf';
import Card from '../../components/Card/Card';
import Footer from '../../components/Footer/Footer';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCartStore } from '../../stores/cartStore';
import { useProductStore } from '../../stores/productStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useUserStore } from '../../stores/userStore';
import styles from './Product.module.css';

function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState(null);

  const [reviews, setReviews] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const getReviews = useProductStore((state) => state.getReviews);
  const deleteReview = useProductStore((state) => state.deleteReview);
  const toggleHelpful = useProductStore((state) => state.toggleHelpful);

  const addItemToCart = useCartStore((state) => state.addItemToCart);
  const addItemToWishlist = useWishlistStore((state) => state.addItemToWishlist);
  const navigate = useNavigate();

  const userData = useUserStore((state) => state.data);

  /* FOR SEARCHING & PAGINATION */
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('newest');

  async function handleSearch() {
    try {
      const queryObject = { page, limit, sort };
      if (rating) queryObject.rating = rating;
      const reviews = await getReviews(slug, queryObject);
      setReviews(reviews.data.reviews);
      setStatistics(reviews.data.statistics);
      setTotalPage(Number(reviews.data.pagination.totalPages));
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const queryObject = { page, limit, sort };
        if (rating) queryObject.rating = rating;
        const data = (await useProductStore.getState().getProductBySlug(slug)).data.product;
        const [related, reviews] = await Promise.all([
          useProductStore.getState().getProducts({ category: data.category_id._id }),
          getReviews(slug, queryObject),
        ]);
        setProduct(data);
        setSelectedVariant(data.variants[0]);
        setRelatedProducts(related.data.products);
        setReviews(reviews.data.reviews);
        setStatistics(reviews.data.statistics);
        setTotalPage(Number(reviews.data.pagination.totalPages));
        window.scrollTo({ top: 0 });
      } catch (error) {
        toast.error(error.message);
        navigate('/product-doesnt-exist');
      }
    })();
  }, [slug]);

  useEffect(() => {
    (async () => await handleSearch())();
  }, [page, limit, rating, sort]);

  return (
    <>
      <Navbar />

      <div className={styles.product}>
        <div className={styles.left}>
          <div className={styles.imageColumn}>
            {product?.variants.map((v) => (
              <button
                key={v._id}
                className={v == selectedVariant ? styles.selecting : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(v);
                }}
              >
                <img src={v.main_image_url} alt="item" />
              </button>
            ))}
          </div>
          <div className={styles.imageMain}>
            <img src={selectedVariant?.main_image_url} alt="product main" />
          </div>
        </div>

        <div className={styles.right}>
          <h2>{product?.name}</h2>
          {statistics?.totalReviews > 0 && (
            <div>
              {[...Array(Math.round(statistics?.averageRating))].map((_, i) => (
                <i key={`filled-${i}`} className={`fa-solid fa-star ${styles.yellow}`}></i>
              ))}
              {[...Array(5 - Math.round(statistics?.averageRating))].map((_, i) => (
                <i
                  key={`empty-${i}`}
                  className={`fa-solid fa-star ${styles.yellow} ${styles.grey}`}
                ></i>
              ))}
            </div>
          )}
          <div className={styles.price}>{`${selectedVariant?.price}đ`}</div>
          <p>{product?.description}</p>
          <hr />

          <div className={styles.variantButtons}>
            {product?.variants.map((v, i) => (
              <button
                key={v._id}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(v);
                }}
              >
                {i}
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <div className={styles.quantityButtons}>
              <button
                onClick={() => {
                  if (quantity > 1) setQuantity((q) => q - 1);
                }}
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <span>{quantity}</span>
              <button
                className={styles.red}
                onClick={() => {
                  setQuantity((q) => q + 1);
                }}
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>

            <button
              className={styles.red}
              onClick={(e) => {
                e.preventDefault();
                addItemToCart(selectedVariant?._id, quantity)
                  .then(() => toast.success('Item added to cart'))
                  .catch((error) => toast.error(error.message));
              }}
            >
              Add To Cart
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                addItemToWishlist(product?._id)
                  .then(() => toast.success('Item added to wishlist'))
                  .catch((error) => toast.error(error.message));
              }}
            >
              <i className="fa-regular fa-heart"></i>
            </button>
          </div>

          {selectedVariant?.attributes && Object.keys(selectedVariant.attributes).length > 0 && (
            <>
              <div>Properties:</div>
              <table>
                <tbody>
                  {Object.entries(selectedVariant.attributes).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {relatedProducts && (
        <Shelf topic={'Related Item'}>
          {relatedProducts.map((item) => (
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

      {reviews && (
        <div className={styles.reviews}>
          <h2>Reviews</h2>
          {statistics?.totalReviews > 0 ? (
            <>
              <div>
                <div>
                  {statistics.averageRating > 0 ? (
                    <i className={`fa-solid fa-star ${styles.yellow}`}></i>
                  ) : (
                    <i className={`fa-solid fa-star ${styles.grey}`}></i>
                  )}
                  <strong>{Math.round(statistics.averageRating * 10) / 10}</strong>
                  {` (${statistics.totalReviews} reviews)`}
                </div>
                <div className={styles.filter}>
                  <strong>Filter By:</strong>
                  <div>
                    Rating:
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                      <option value="">All</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  <div>
                    Sort By:
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                      <option value="newest">Newest</option>
                      <option value="helpful">Helpful</option>
                      <option value="rating_high">Highest Rating</option>
                      <option value="rating_low">Lowest Rating</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.reviewList}>
                {reviews.map((review) => (
                  <div key={review._id} className={styles.reviewItem}>
                    <div>
                      <div>
                        {review.user_id.fullName}
                        <br />
                        {[...Array(Math.round(review.rating))].map((_, i) => (
                          <i
                            key={`filled-${i}`}
                            className={`fa-solid fa-star ${styles.yellow}`}
                          ></i>
                        ))}
                        {[...Array(5 - Math.round(review.rating))].map((_, i) => (
                          <i
                            key={`empty-${i}`}
                            className={`fa-solid fa-star ${styles.yellow} ${styles.grey}`}
                          ></i>
                        ))}
                      </div>
                      <div>
                        Mark as helpful {review.helpful_count + ' '}
                        <button
                          onClick={() =>
                            toggleHelpful(review._id)
                              .then(() => getReviews(slug, { page, limit, rating, sort }))
                              .then((res) => setReviews(res.data.reviews))
                              .catch((err) => toast.error(err.message))
                          }
                        >
                          <i className="fa-solid fa-thumbs-up"></i>
                        </button>
                      </div>
                    </div>

                    <div>
                      <strong>{review.title}</strong>
                      <br />
                      {review.comment}
                    </div>

                    {review.images.length > 0 && (
                      <div className={styles.reviewImages}>
                        {review.images.map((image) => (
                          <img key={image} src={image} alt="review" />
                        ))}
                      </div>
                    )}

                    {userData && review.user_id._id == userData._id && (
                      <button
                        onClick={() =>
                          deleteReview(review._id)
                            .then(() => {
                              if (page != 1) setPage(1);
                              else handleSearch();
                            })
                            .catch((err) => toast.error(err.message))
                        }
                      >
                        <i className="fa-solid fa-x"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {reviews.length > 0 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => {
                      if (page > 1) setPage((p) => p - 1);
                    }}
                  >
                    &lt;
                  </button>
                  <span>
                    {page} / {totalPage}
                  </span>
                  <button
                    onClick={() => {
                      if (page < totalPage) setPage((p) => p + 1);
                    }}
                  >
                    &gt;
                  </button>
                  <br />
                  Reviews per page:
                  <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
              )}
            </>
          ) : (
            <div>No reviews data</div>
          )}
        </div>
      )}

      <Footer />
    </>
  );
}

export default Product;
