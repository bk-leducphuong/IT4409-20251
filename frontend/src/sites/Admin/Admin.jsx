import Sidebar from '../../components/Sidebar/Sidebar';
import UsersReport from '../../components/UsersReport/UsersReport';
import BrandReport from '../../components/BrandReport/BrandReport';
import CategoryReport from '../../components/CategoryReport/CategoryReport';
import styles from './Admin.module.css';

function Admin() {
  return (
    <>
      <section className={styles.left}>
        <Sidebar />
      </section>
      <section className={styles.right}>
        <UsersReport />
        <BrandReport />
        <CategoryReport />
      </section>
    </>
  );
}

export default Admin;
