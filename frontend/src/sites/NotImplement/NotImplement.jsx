import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './NotImplement.module.css';

function NotImplement() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2>Page hasn&apos;t been implemented yet!</h2>
      </div>
      <Footer />
    </>
  );
}

export default NotImplement;
