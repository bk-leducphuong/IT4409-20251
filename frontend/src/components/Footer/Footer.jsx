import styles from "./Footer.module.css";

function Footer() {
    
    return (
        <footer className={styles.footer}>
            <div className={styles.listsWarpper}>

                <div className={styles.list}>
                    <div className={styles.listHeader}>Exclusive</div>
                    <div className={styles.subcribe}>Subcribe</div>
                    <div>Get 10% off your first order</div>
                    <div className={styles.emailContainer}>
                        <input type="email" placeholder="Enter your email" className={styles.emailInput}/>
                        <i className={`fa-regular fa-paper-plane ${styles.sendIcon}`}></i>
                    </div>
                </div>

                <div className={styles.list}>
                    <div className={styles.listHeader}>Support</div>
                    <div>111 Bijoy sarani Dhaka, DH 1515, Bangladesh</div>
                    <div>exclusive@gmail.com</div>
                    <div>+88015-88888-9999</div>
                </div>

                <div className={styles.list}>
                    <div className={styles.listHeader}>Account</div>
                    <div>My account</div>
                    <div>Login / Register</div>
                    <div>Cart</div>
                    <div>Wishlist</div>
                    <div>Shop</div>
                </div>

                <div className={styles.list}>
                    <div className={styles.listHeader}>Quick Link</div>
                    <div>Privacy Policy</div>
                    <div>Terms Of Use</div>
                    <div>FAQ</div>
                    <div>Contact</div>
                </div>

                <div className={styles.list}>
                    <div className={styles.listHeader}>Download App</div>
                    <div className={styles.subText}>Save $3 with App New User Only</div>
                    <div className={styles.imagesContainer}>
                        <div className={styles.qrContainer}>
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                alt="QR code"
                                className={styles.qr}
                            />
                        </div>
                        <div className={styles.ggPlayAndAppStoreContainer}>
                            <div className={styles.ggPlayContainer}>
                                <img
                                    src="https://qldt.hust.edu.vn/students/_next/image?url=%2Fstudents%2Fimages%2Fchplay-en.png&w=384&q=75"
                                    alt="Google Play"
                                    className={styles.ggPlay}
                                />
                            </div>
                            <div className={styles.appStoreContainer}>
                                <img
                                    src="https://qldt.hust.edu.vn/students/_next/image?url=%2Fstudents%2Fimages%2Fappstore-en.avif&w=384&q=75"
                                    alt="App Store"
                                    className={styles.appStore}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.iconsContainer}>
                        <i className="fa-brands fa-facebook-f"></i>
                        <i className="fa-brands fa-twitter"></i>
                        <i className="fa-brands fa-instagram"></i>
                        <i className="fa-brands fa-linkedin-in"></i>
                    </div>
                </div>
            </div>
            <div className={styles.tail}>&copy; Copyright Rimel 2022. All right reserved</div>
        </footer>
    );
}

export default Footer;