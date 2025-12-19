import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/Button/Button';
import Footer from '../../components/Footer/Footer';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useProductStore } from '../../stores/productStore';
import styles from './Review.module.css';

function ReviewItem({ item }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createReview = useProductStore((state) => state.createReview);

  return (
    <div className={styles.reviewItem}>
      <div>
        <div>
          <img src={item.image_url} alt="product" />
          <div>
            <h2>{item.product_name}</h2>
            <div>{item.sku}</div>
          </div>
        </div>
        <div>
          {[...Array(5)].map((_, i) => (
            <button key={i} onClick={() => setRating(i + 1)}>
              <i
                className={`fa-solid fa-star ${rating >= i + 1 ? styles.yellow : styles.grey}`}
              ></i>
            </button>
          ))}
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Title of the review"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <textarea
          placeholder="Give us more about product"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div>
        <Button
          onClick={() => {
            if (rating == 0) return toast.error('Please rate the product');
            createReview(item.product_slug, rating, title, description)
              .then(() => toast.success('Review posted'))
              .catch((err) => toast.error(err.message));
          }}
        >
          Post
        </Button>
      </div>
    </div>
  );
}

function Review() {
  const { state } = useLocation();
  const items = state?.products;

  return (
    <>
      <Navbar />

      {items && items.length > 0 ? (
        <div className={styles.reviews}>
          {items.map((item) => (
            <ReviewItem key={item.product_variant_id} item={item} />
          ))}
        </div>
      ) : (
        <h2>
          <i className="fa-solid fa-box-open"></i>
          No items to reviews
        </h2>
      )}

      <Footer />
    </>
  );
}

export default Review;
