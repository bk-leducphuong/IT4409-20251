import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import { useState } from 'react';
import styles from './Cart.module.css';

function CartItem({ image, productName, newPrice, quantity, onQuantityChange }) {
  const subtotal = quantity * newPrice;

  return (
    <tr className={styles.cartItem}>
      <td>
        <div className={styles.productInfo}>
          <div className={styles.imageContainer}>
            <img src={image} alt="Product" className={styles.image} />
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
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
          className={styles.numberInput}
        />
      </td>
      <td>{`$${subtotal}`}</td>
    </tr>
  );
}

function Cart() {
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

  // store quantities for each item
  const [cartItems, setCartItems] = useState(exampleData.map((item) => ({ ...item, quantity: 1 })));

  // calculate total whenever cartItems change
  const total = cartItems.reduce((sum, item) => sum + item.newPrice * item.quantity, 0);

  const handleQuantityChange = (index, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: newQuantity } : item)),
    );
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
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
            {cartItems.map((item, index) => (
              <CartItem
                key={index}
                image={item.image}
                productName={item.productName}
                newPrice={item.newPrice}
                quantity={item.quantity}
                onQuantityChange={(q) => handleQuantityChange(index, q)}
              />
            ))}
          </tbody>
        </table>

        <div className={styles.buttonsConatiner}>
          <Button backgroundColor="white">Return To Shop</Button>
          <Button backgroundColor="white">Update Cart</Button>
        </div>

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
            <Button>Process to Checkout</Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Cart;
