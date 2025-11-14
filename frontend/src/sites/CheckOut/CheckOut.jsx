import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
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
  const exampleData = [
    {
      image: 'https://sc04.alicdn.com/kf/Hcb90256847954da7a90b3ce53d76d9c3r.jpg',
      productName: 'LCD Monitor',
      newPrice: 650,
    },
    {
      image:
        'https://th.bing.com/th/id/R.8d1e0199c5ebe4fab3e5fee28aa0dbda?rik=sQ7TrFvVmvzNzA&pid=ImgRaw&r=0',
      productName: 'H1 GamePad',
      newPrice: 550,
    },
  ];

  const total = exampleData.reduce((sum, item) => sum + item.newPrice, 0);

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
              {exampleData.map((data, i) => {
                return (
                  <CheckOutItem
                    key={i}
                    image={data.image}
                    productName={data.productName}
                    totalPrice={data.newPrice}
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
