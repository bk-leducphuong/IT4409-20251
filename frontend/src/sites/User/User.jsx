import Navbar from '../../components/Navbar/Navbar';
import OrderDetail from '../../components/OrderDetail/OrderDetail';
import UserDetail from '../../components/UserDetail/UserDetail';
import Footer from '../../components/Footer/Footer';
import styles from './User.module.css';
import { useState } from 'react';

function User() {
  const [state, setState] = useState('user');

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.left}>
          <button onClick={() => setState('user')} className={state === 'user' ? styles.red : ''}>
            My Profile
          </button>
          <button onClick={() => setState('order')} className={state === 'order' ? styles.red : ''}>
            My Orders
          </button>
        </div>
        <div className={styles.right}>
          {state === 'user' && <UserDetail />}
          {state === 'order' && <OrderDetail />}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default User;
