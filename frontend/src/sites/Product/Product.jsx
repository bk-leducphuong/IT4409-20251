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
import styles from './Product.module.css';

function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState(null);

  const addItemToCart = useCartStore((state) => state.addItemToCart);
  const addItemToWishlist = useWishlistStore((state) => state.addItemToWishlist);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = (await useProductStore.getState().getProductBySlug(slug)).data.product;
        const category = data.category_id.slug;
        const related = (await useProductStore.getState().getProducts({ category })).data.products;
        setProduct(data);
        setSelectedVariant(data.variants[0]);
        setRelatedProducts(related);
        window.scrollTo({ top: 0 });
      } catch (error) {
        toast.error(error.message);
        navigate('/product-doesnt-exist');
      }
    })();
  }, [slug]);

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
          <div>Rating</div>
          <div className={styles.price}>{`$${selectedVariant?.price}`}</div>
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

      <Footer />
    </>
  );
}

export default Product;
