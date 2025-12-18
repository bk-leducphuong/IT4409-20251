import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import styles from './Navbar.module.css';

function Navbar() {
  const [productName, setProductName] = useState('');
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const userData = useUserStore((state) => state.data);
  const resetUser = useUserStore((state) => state.resetUser);
  const cartData = useCartStore((state) => state.data);
  const wishlistData = useWishlistStore((state) => state.data);

  async function componentLogout() {
    try {
      await logout();
      resetUser();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>Exclusive</div>

        <div className={styles.ulContainer}>
          <ul className={styles.ul}>
            <li
              className={`${styles.li} ${window.location.pathname === '/' ? styles.underline : ''}`}
            >
              <button onClick={() => navigate('/')}>Home</button>
            </li>

            <li
              className={`${styles.li} ${window.location.pathname === '/contact' ? styles.underline : ''}`}
            >
              <button onClick={() => navigate('/contact')}>Contact</button>
            </li>

            <li
              className={`${styles.li} ${window.location.pathname === '/about' ? styles.underline : ''}`}
            >
              <button onClick={() => navigate('/about')}>About</button>
            </li>

            <li
              className={`${styles.li} ${window.location.pathname === '/login' ? styles.underline : ''}`}
            >
              <button
                onClick={() =>
                  userData ? toast.error('You have already logged in') : navigate('/login')
                }
              >
                Sign Up
              </button>
            </li>
          </ul>
        </div>

        <div className={styles.inputContainer}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (productName.trim()) {
                navigate(`/products?product=${encodeURIComponent(productName.trim())}`);
              } else {
                toast.error('Please enter a product name to search');
              }
            }}
          >
            <input
              type="text"
              placeholder="What are you looking for?"
              className={styles.input}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <button
              type="submit"
              className={styles.searchIcon}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>

        <div className={styles.iconContainer}>
          <button onClick={() => navigate('/wistlist')}>
            <i className="fa-regular fa-heart">
              {wishlistData && wishlistData.length ? <span>{wishlistData.length}</span> : null}
            </i>
          </button>
          <button onClick={() => navigate('/cart')}>
            <i className="fa-solid fa-cart-shopping">
              {cartData && cartData.length > 0 ? <span>{cartData.length}</span> : null}
            </i>
          </button>
          {userData && (
            <i className={`fa-solid fa-circle-user ${styles.dropbar}`}>
              <div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/user');
                  }}
                >
                  <i className="fa-solid fa-circle-user"></i>
                  Manage my account
                </button>
                {/* <button>
                  <i className="fa-solid fa-basket-shopping"></i>
                  My order
                </button>
                <button>
                  <i className="fa-solid fa-xmark"></i>
                  My cancellations
                </button> */}
                {userData?.role == 'admin' && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/admin');
                    }}
                  >
                    <i className="fa-solid fa-lock"></i>
                    Admin
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    componentLogout();
                  }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  Logout
                </button>
              </div>
            </i>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
