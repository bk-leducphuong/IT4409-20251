import { useAdminStore } from '../../stores/adminStore';
import { useAuthStore } from '../../stores/authStore';
import { useBrandStore } from '../../stores/brandStore';
import { useCartStore } from '../../stores/cartStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { useProductStore } from '../../stores/productStore';
import { useUserStore } from '../../stores/userStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import styles from './Loading.module.css';

function Loading() {
  const adminLoading = useAdminStore((state) => state.isLoading);
  const authLoading = useAuthStore((state) => state.isLoading);
  const brandLoading = useBrandStore((state) => state.isLoading);
  const cartLoading = useCartStore((state) => state.isLoading);
  const categoryLoading = useCategoryStore((state) => state.isLoading);
  const productLoading = useProductStore((state) => state.isLoading);
  const wishlistLoading = useWishlistStore((state) => state.isLoading);
  const userLoading = useUserStore((state) => state.isLoading);

  const loading =
    adminLoading ||
    authLoading ||
    brandLoading ||
    userLoading ||
    cartLoading ||
    categoryLoading ||
    wishlistLoading ||
    productLoading;

  return loading ? (
    <div className={styles.wrapper}>
      <div className={styles.mark} style={{ animationDelay: '0s' }} />
      <div className={styles.mark} style={{ animationDelay: '0.1s' }} />
      <div className={styles.mark} style={{ animationDelay: '0.2s' }} />
      <div className={styles.mark} style={{ animationDelay: '0.3s' }} />
    </div>
  ) : null;
}

export default Loading;
