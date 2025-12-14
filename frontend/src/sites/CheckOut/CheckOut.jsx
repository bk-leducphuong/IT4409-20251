import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import { useEffect, useState } from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useOrderStore } from '../../stores/orderStore';
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
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPayMentMethod] = useState('cod');
  const [coupon, setCoupon] = useState('');

  const cart = useCartStore((state) => state.data);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const total = cart.reduce((sum, item) => sum + item.product_variant_id.price * item.quantity, 0);

  const createOrder = useOrderStore((state) => state.createOrder);

  async function handleCreateOrder() {
    try {
      await createOrder(fullName, phone, street, city, postalCode, country, paymentMethod, note);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    useCartStore.getState().loadCart();
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.checkOutContainer}>
        <h1>Billing Details</h1>

        <div className={styles.sectionWarpper}>
          <section className={styles.left}>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Full name</div>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Street Address</div>
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Town/City</div>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Country</div>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Postal Code</div>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Phone Number</div>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Email Address</div>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={`${styles.input} ${styles.width08}`}>
              <div>Additional note</div>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}></textarea>
            </div>
          </section>

          <section className={styles.right}>
            <div className={`${styles.details} ${styles.width08}`}>
              {cart &&
                cart.map((item) => {
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
                  <input
                    type="radio"
                    onChange={() => setPayMentMethod('bank_transfer')}
                    checked={paymentMethod === 'bank_transfer'}
                  />
                  Bank
                </div>
                <div>
                  <i className="fa-brands fa-cc-visa"></i>
                  <i className="fa-brands fa-cc-mastercard"></i>
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="radio"
                    onChange={() => setPayMentMethod('cod')}
                    checked={paymentMethod == 'cod'}
                  />
                  Cash on delivery
                </div>
              </div>
            </div>

            <div className={styles.buttons}>
              <input
                type="text"
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  applyCoupon(coupon).catch((err) => {
                    console.error(err);
                    alert(err);
                  });
                }}
              >
                Apply Coupon
              </Button>
              <Button onClick={handleCreateOrder}>Place Order</Button>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CheckOut;
