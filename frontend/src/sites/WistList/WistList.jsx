import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Shelf from '../../components/Shelf/Shelf';
import Card from '../../components/Card/Card';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useEffect } from 'react';

function WistList() {
  const wishlist = useWishlistStore((state) => state.data);
  const loadWishlist = useWishlistStore((state) => state.loadWishlist);
  const deleteItemFromWishlist = useWishlistStore((state) => state.deleteItemFromWishlist);

  async function handleDeleteItem(id) {
    try {
      await deleteItemFromWishlist(id);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await loadWishlist();
      } catch {
        // intentionally ignored
      }
    })();
  }, []);

  return (
    <>
      <Navbar />
      <Shelf
        name={`Wistlist${wishlist?.length > 0 ? ` (${wishlist.length})` : ''}`}
        buttonName="Move All To Bag"
      >
        {wishlist &&
          wishlist.map((item) => (
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
      <Shelf name="Just For You" buttonName="See All">
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
      </Shelf>
      <Footer />
    </>
  );
}

export default WistList;
