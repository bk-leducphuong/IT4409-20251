import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import styles from './Loading.module.css';

function Loading({ isLoading = false }) {
  const authLoading = useAuthStore((state) => state.isLoading);
  const userLoading = useUserStore((state) => state.isLoading);

  const loading = isLoading || authLoading || userLoading;

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
