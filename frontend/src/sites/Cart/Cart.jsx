import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import { useCartStore } from '../../stores/cartStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cart.module.css';

function CartItem({ id, image, productName, newPrice, quantity }) {
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeItemFromCart = useCartStore((state) => state.removeItemFromCart);
  const subtotal = quantity * newPrice;

  async function handleQuantityChange(newQuantity) {
    try {
      await updateItemQuantity(id, newQuantity);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  async function handleDeleteItem() {
    try {
      await removeItemFromCart(id);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  return (
    <tr className={styles.cartItem}>
      <td>
        <div className={styles.productInfo}>
          <div className={styles.imageContainer}>
            <img src={image} alt="Product" className={styles.image} />
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDeleteItem();
              }}
            >
              &times;
            </button>
          </div>
          <div>{productName}</div>
        </div>
      </td>
      <td>{`$${newPrice}`}</td>
      <td>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => {
            e.preventDefault();
            handleQuantityChange(e.target.value);
          }}
          className={styles.numberInput}
        />
      </td>
      <td>{`$${subtotal}`}</td>
    </tr>
  );
}

function Cart() {
  const cart = useCartStore((state) => state.data);
  const loadCart = useCartStore((state) => state.loadCart);
  const navigate = useNavigate();
  const haveItem = cart && cart.length > 0;
  const total =
    cart?.reduce((sum, item) => sum + item.product_variant_id.price * item.quantity, 0) ?? 0;

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        {haveItem ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr className={styles.cartItem}>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart &&
                  cart.map((item) => (
                    <CartItem
                      key={item.product_variant_id._id}
                      id={item.product_variant_id._id}
                      image={item.product_variant_id.main_image_url}
                      productName={item.product_variant_id.product_id.name}
                      newPrice={item.product_variant_id.price}
                      quantity={item.quantity}
                    />
                  ))}
              </tbody>
            </table>

            <div className={styles.buttonsConatiner}>
              <Button
                backgroundColor="white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                Return To Shop
              </Button>
              <Button backgroundColor="white">Clear Cart</Button>
            </div>
          </>
        ) : (
          <div className={styles.notice}>
            <div>
              <i className="fa-solid fa-cart-shopping"></i>
              No item in your cart
            </div>
            <div>
              <Button
                backgroundColor="white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                Return To Shop
              </Button>
            </div>
          </div>
        )}

        {haveItem && (
          <div className={styles.checkout}>
            <div className={styles.coupon}>
              <input type="text" placeholder="Coupon code" />
              <Button>Apply Coupon</Button>
            </div>
            <div className={styles.checkoutDetails}>
              <div className={styles.header}>Cart Total</div>
              <div className={`${styles.detail} ${styles.underline}`}>
                <div>Subtotal:</div>
                <div>{`$${total}`}</div>
              </div>
              <div className={`${styles.detail} ${styles.underline}`}>
                <div>Shipping:</div>
                <div>Free</div>
              </div>
              <div className={styles.detail}>
                <div>Total:</div>
                <div>{`$${total}`}</div>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/checkout');
                }}
              >
                Process to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Cart;
