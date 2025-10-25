import styles from "./NotFound.module.css"

function NotFound() {
    
    return (
        <div className={styles.container}>
            <div className={styles.main}>404 Not Found</div>
            <div className={styles.sub}>Your visited page not found. You may go to home page</div>
            <button className={styles.button}>Back to home page</button>
        </div>
    );
}

export default NotFound;