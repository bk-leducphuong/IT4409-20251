import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import styles from './Navbar.module.css';

function Navbar({ numberWishListItems = 0, numberCartItems = 0 }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const resetToken = useAuthStore((state) => state.resetToken);
  const userData = useUserStore((state) => state.data);
  const resetUser = useUserStore((state) => state.resetUser);

  async function componentLogout() {
    try {
      await logout();
      resetToken();
      resetUser();
      navigate('/');
    } catch (err) {
      alert(err);
      console.error(err);
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
                  userData ? alert('You have already logged in') : navigate('/login')
                }
              >
                Sign Up
              </button>
            </li>
          </ul>
        </div>

        <div className={styles.inputContainer}>
          <input type="text" placeholder="What are you looking for?" className={styles.input} />
          <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
        </div>

        <div className={styles.iconContainer}>
          <button onClick={() => navigate('/wistlist')}>
            <i className="fa-regular fa-heart">
              {numberWishListItems ? <span>{numberWishListItems}</span> : null}
            </i>
          </button>
          <button onClick={() => navigate('/cart')}>
            <i className="fa-solid fa-cart-shopping">
              {numberCartItems ? <span>{numberCartItems}</span> : null}
            </i>
          </button>
          {userData ? (
            <i className={`fa-solid fa-circle-user ${styles.dropbar}`}>
              <div>
                <button>
                  <i className="fa-solid fa-circle-user"></i>
                  Manage my account
                </button>
                <button>
                  <i className="fa-solid fa-basket-shopping"></i>
                  My order
                </button>
                <button>
                  <i className="fa-solid fa-xmark"></i>
                  My cancellations
                </button>
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
          ) : (
            <i className={`fa-solid fa-circle-user ${styles.hidden}`}></i>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
