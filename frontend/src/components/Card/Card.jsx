import styles from "./Card.module.css";

function Card(props) {
    const discount = Math.round((props.oldPrice - props.newPrice) / props.oldPrice * 100);
    const rating = Math.max(0, Math.min(5, Math.round(props.rating || 0)));

    return (
        <div className={styles.cardContainer}>

            <div className={styles.imageContainer}>
                <img
                    src="https://th.bing.com/th/id/R.8d1e0199c5ebe4fab3e5fee28aa0dbda?rik=sQ7TrFvVmvzNzA&pid=ImgRaw&r=0"
                    alt="product image"
                    className={styles.image}
                />
                <div className={styles.discount}>{`${discount}%`}</div>
                <div className={styles.iconContainer}>
                    <i className={`fa-regular fa-heart ${styles.icon}`}></i>
                    <i className={`fa-regular fa-eye ${styles.icon}`}></i>
                </div>
            </div>

            <div className={styles.cardDetails}>
                <div className={styles.productName}>{props.productName}</div>

                <div>
                    <span className={styles.newPrice}>{`$${props.newPrice}`}</span>
                    <span className={styles.oldPrice}>{`$${props.oldPrice}`}</span>
                </div>

                <div className={styles.rating}>
                    {[...Array(rating)].map((_, i) => (
                        <i key={`filled-${i}`} className={`fa-solid fa-star ${styles.star}`}></i>
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                        <i key={`empty-${i}`} className={`fa-solid fa-star ${styles.star} ${styles.faded}`}></i>
                    ))}
                </div>
            </div>

            

        </div>
    );
}

export default Card;