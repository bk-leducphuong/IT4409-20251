import styles from './Navbar.module.css';

function Navbar({
  currentPage = 'home',
  numberWishListItems = 0,
  numberCartItems = 0,
  isLoggedin = false,
}) {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo}>Exclusive</div>

        <div className={styles.ulContainer}>
          <ul className={styles.ul}>
            <li className={`${styles.li} ${currentPage === 'home' ? styles.underline : ''}`}>
              <button className={styles.a}>Home</button>
            </li>

            <li className={`${styles.li} ${currentPage === 'contact' ? styles.underline : ''}`}>
              <button className={styles.a}>Contact</button>
            </li>

            <li className={`${styles.li} ${currentPage === 'about' ? styles.underline : ''}`}>
              <button className={styles.a}>About</button>
            </li>

            <li className={`${styles.li} ${currentPage === 'sign up' ? styles.underline : ''}`}>
              <button className={styles.a}>Sign Up</button>
            </li>
          </ul>
        </div>

        <div className={styles.inputContainer}>
          <input type="text" placeholder="What are you looking for?" className={styles.input} />
          <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
        </div>

        <div className={styles.iconContainer}>
          <i className="fa-regular fa-heart">
            {numberWishListItems ? <span>{numberWishListItems}</span> : null}
          </i>
          <i className="fa-solid fa-cart-shopping">
            {numberCartItems ? <span>{numberCartItems}</span> : null}
          </i>
          {isLoggedin ? (
            <i className={`fa-solid fa-circle-user ${styles.dropbar}`}>
              <div>
                <div>
                  <i className="fa-solid fa-circle-user"></i>
                  Manage my account
                </div>
                <div>
                  <i className="fa-solid fa-basket-shopping"></i>
                  My order
                </div>
                <div>
                  <i className="fa-solid fa-xmark"></i>
                  My cancellations
                </div>
                <div>
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  Logout
                </div>
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
