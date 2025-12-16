import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Shelf from '../../components/Shelf/Shelf';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../../stores/wishlistStore';
import styles from './WistList.module.css';

function WistList() {
  const wishlist = useWishlistStore((state) => state.data);
  const loadWishlist = useWishlistStore((state) => state.loadWishlist);
  const deleteItemFromWishlist = useWishlistStore((state) => state.deleteItemFromWishlist);
  const haveItem = wishlist && wishlist.length > 0;
  const navigate = useNavigate();

  async function handleDeleteItem(id) {
    try {
      await deleteItemFromWishlist(id);
      toast.success('Item deleted from wishlist');
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await loadWishlist();
      } catch (err) {
        toast.error(err.message);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />

      {haveItem ? (
        <Shelf name={`Wistlist${wishlist?.length > 0 ? ` (${wishlist.length})` : ''}`}>
          {wishlist.map((item) => (
            <Card
              key={item.product_id._id}
              productName={item.product_id.name}
              newPrice={item.product_id.min_price}
              image={item.product_id.variants?.[0]?.main_image_url}
              iconButtons={
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteItem(item.product_id._id);
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              }
            />
          ))}
        </Shelf>
      ) : (
        <div className={styles.notice}>
          <div>
            <i className="fa-solid fa-heart"></i>
            No item in your wistlist
          </div>
          <div>
            <Button
              backgroundColor="white"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              Return To Shop
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default WistList;
