import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useState } from 'react';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const userData = useUserStore((state) => state.data);
  const resetUser = useUserStore((state) => state.resetUser);
  const cartData = useCartStore((state) => state.data);
  const wishlistData = useWishlistStore((state) => state.data);
  const [searchInput, setSearchInput] = useState('');

  async function componentLogout() {
    try {
      await logout();
      resetUser();
      navigate('/');
    } catch (err) {
      alert(err);
      console.error(err);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchInput.trim() === '') {
      alert('Please enter a search term');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    setSearchInput('');
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

        <form className={styles.inputContainer} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="What are you looking for?"
            className={styles.input}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            className={styles.searchButton}
            onClick={handleSearch}
          >
            <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
          </button>
        </form>

        <div className={styles.iconContainer}>
          <button onClick={() => navigate('/wistlist')}>
            <i className="fa-regular fa-heart">
              {wishlistData.length ? <span>{wishlistData.length}</span> : null}
            </i>
          </button>
          <button onClick={() => navigate('/cart')}>
            <i className="fa-solid fa-cart-shopping">
              {cartData.length > 0 ? <span>{cartData.length}</span> : null}
            </i>
          </button>
          {userData ? (
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
                <button>
                  <i className="fa-solid fa-basket-shopping"></i>
                  My order
                </button>
                <button>
                  <i className="fa-solid fa-xmark"></i>
                  My cancellations
                </button>
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
          ) : (
            <i className={`fa-solid fa-circle-user ${styles.hidden}`}></i>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
