import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.main}>404 Not Found</div>
      <div className={styles.sub}>Your visited page not found. You may go to home page</div>
      <div className={styles.button}>
        <Button onClick={() => navigate('/')}>Back to home page</Button>
      </div>
    </div>
  );
}

export default NotFound;
