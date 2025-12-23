import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import { useCartStore } from '../../stores/cartStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './Cart.module.css';

function CartItem({ id, image, productName, newPrice, quantity }) {
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const removeItemFromCart = useCartStore((state) => state.removeItemFromCart);
  const subtotal = quantity * newPrice;

  async function handleQuantityChange(newQuantity) {
    try {
      await updateItemQuantity(id, newQuantity);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDeleteItem() {
    try {
      await removeItemFromCart(id);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err.message);
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
      <td>{`${newPrice}đ`}</td>
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
      <td>{`${subtotal}đ`}</td>
    </tr>
  );
}

function Cart() {
  const cart = useCartStore((state) => state.data);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const loadCart = useCartStore((state) => state.loadCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [coupon, setCoupon] = useState('');
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const navigate = useNavigate();
  const haveItem = cart && cart.length > 0;
  const subTotal = useCartStore((state) => state.subTotal);
  const shippingFee = useCartStore((state) => state.shippingFee);
  const total = useCartStore((state) => state.total);

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
              <Button
                backgroundColor="white"
                onClick={(e) => {
                  e.preventDefault();
                  clearCart()
                    .then(() => toast.success('Cart cleared'))
                    .catch((err) => toast.error(err.message));
                }}
              >
                Clear Cart
              </Button>
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
            <div>
              <div className={styles.coupon}>
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    applyCoupon(coupon)
                      .then(() => toast.success('Coupon applied'))
                      .catch((err) => toast.error(err.message));
                  }}
                >
                  Apply Coupon
                </Button>
              </div>
              {appliedCoupon && (
                <div className={styles.appliedCoupon}>
                  <strong>Applied Coupon: </strong>
                  <div className={styles.couponCode}>
                    {appliedCoupon.code}
                    <button
                      onClick={() =>
                        removeCoupon()
                          .then(() => toast.success('Coupon removed'))
                          .catch((err) => toast.error(err.message))
                      }
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.checkoutDetails}>
              <div className={styles.header}>Cart Total</div>
              <div className={`${styles.detail} ${styles.underline}`}>
                <div>Subtotal:</div>
                <div>{`${subTotal}đ`}</div>
              </div>
              <div className={`${styles.detail} ${styles.underline}`}>
                <div>Shipping:</div>
                <div>{`${shippingFee}đ`}</div>
              </div>
              <div className={styles.detail}>
                <div>Total:</div>
                <div>{`${total}đ`}</div>
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
