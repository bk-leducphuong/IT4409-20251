import styles from "./Navbar.module.css";

function Navbar() {

    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <div className={styles.logo}>Exclusive</div>

                <div className={styles.ulContainer}>
                    <ul className={styles.ul}>
                        <li className={styles.li}>
                            <a href="#" className={styles.a}>Home</a>
                        </li>

                        <li className={styles.li}>
                            <a href="#" className={styles.a}>Contact</a>
                        </li>

                        <li className={styles.li}>
                            <a href="#" className={styles.a}>About</a>
                        </li>

                        <li className={styles.li}>
                            <a href="#" className={styles.a}>Sign Up</a>
                        </li>
                    </ul>
                </div>

                <div className={styles.inputContainer}>
                    <input type="text" placeholder="What are you looking for?" className={styles.input}/>
                    <i className={`fa-solid fa-magnifying-glass ${styles.searchIcon}`}></i>
                </div>

                <div className={styles.iconContainer}>
                    <i className="fa-regular fa-heart"></i>
                    <i className="fa-solid fa-cart-shopping"></i>
                    <i className="fa-solid fa-circle-user"></i>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;