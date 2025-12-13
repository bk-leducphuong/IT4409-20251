import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import { useEffect } from 'react';
import { useCartStore } from '../../stores/cartStore';
import styles from './CheckOut.module.css';

function CheckOutItem({ image, productName, totalPrice }) {
  return (
    <div className={styles.item}>
      <div>
        <img src={image} alt="Product" />
        <div>{productName || 'Product Name'}</div>
      </div>
      <div>{`$${totalPrice || 0}`}</div>
    </div>
  );
}

function CheckOut() {
  const cart = useCartStore((state) => state.data);
  const loadCart = useCartStore((state) => state.loadCart);
  const total = cart.reduce((sum, item) => sum + item.product_variant_id.price * item.quantity, 0);

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.checkOutContainer}>
        <h1>Billing Details</h1>

        <div className={styles.sectionWarpper}>
          <section className={styles.left}>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>First name</div>
              <input type="text" />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Company Name</div>
              <input type="text" />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Street Address</div>
              <input type="text" />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Apartment, floor, etc. (optional)</div>
              <input type="text" />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Town/City</div>
              <input type="text" />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Phone Number</div>
              <input type="text" />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Email Address</div>
              <input type="text" />
            </div>
            <div className={styles.checkbox}>
              <input type="checkbox" />
              <div>Save this information for faster check-out next time</div>
            </div>
          </section>

          <section className={styles.right}>
            <div className={`${styles.details} ${styles.width08}`}>
              {cart.map((item) => {
                return (
                  <CheckOutItem
                    key={item.product_variant_id._id}
                    image={item.product_variant_id.main_image_url}
                    productName={item.product_variant_id.product_id.name}
                    totalPrice={item.product_variant_id.price * item.quantity}
                  />
                );
              })}
            </div>

            <div className={styles.width08}>
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
            </div>

            <div className={`${styles.payment} ${styles.width08}`}>
              <div>
                <div>
                  <input type="radio" name="payment method" />
                  Bank
                </div>
                <div>
                  <i className="fa-brands fa-cc-visa"></i>
                  <i className="fa-brands fa-cc-mastercard"></i>
                </div>
              </div>
              <div>
                <div>
                  <input type="radio" name="payment method" />
                  Cash on delivery
                </div>
              </div>
            </div>

            <div className={styles.buttons}>
              <input type="text" placeholder="Coupon Code" />
              <Button>Apply Coupon</Button>
              <Button>Place Order</Button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CheckOut;
