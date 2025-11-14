import styles from './Card.module.css';

function Card(props) {
  const { image, oldPrice, newPrice, rating, productName } = props;

  // Calculate discount only if both prices exist
  const hasDiscount = oldPrice != null && newPrice != null;
  const discount = hasDiscount ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : null;

  // Clamp rating between 0 and 5
  const safeRating = Math.max(0, Math.min(5, Math.round(rating || 0)));

  return (
    <div className={styles.cardContainer}>
      {/* IMAGE */}
      {image && (
        <div className={styles.imageContainer}>
          <img src={image} alt="product" className={styles.image} />

          {/* DISCOUNT */}
          {hasDiscount && <div className={styles.discount}>{`${discount}%`}</div>}

          {/* ICONS */}
          <div className={styles.iconContainer}>
            <i className={`fa-regular fa-heart ${styles.icon}`}></i>
            <i className={`fa-regular fa-eye ${styles.icon}`}></i>
          </div>
        </div>
      )}

      {/* DETAILS */}
      <div className={styles.cardDetails}>
        {/* PRODUCT NAME */}
        {productName && <div className={styles.productName}>{productName}</div>}

        {/* PRICES */}
        {(newPrice != null || oldPrice != null) && (
          <div>
            {newPrice != null && <span className={styles.newPrice}>{`$${newPrice}`}</span>}
            {oldPrice != null && newPrice != null && (
              <span className={styles.oldPrice}>{`$${oldPrice}`}</span>
            )}
            {oldPrice != null && newPrice == null && (
              <span className={styles.oldPrice}>{`$${oldPrice}`}</span>
            )}
          </div>
        )}

        {/* RATING */}
        {rating != null && (
          <div className={styles.rating}>
            {[...Array(safeRating)].map((_, i) => (
              <i key={`filled-${i}`} className={`fa-solid fa-star ${styles.star}`}></i>
            ))}
            {[...Array(5 - safeRating)].map((_, i) => (
              <i
                key={`empty-${i}`}
                className={`fa-solid fa-star ${styles.star} ${styles.faded}`}
              ></i>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
