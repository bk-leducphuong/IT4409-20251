import Sidebar from '../../components/Sidebar/Sidebar';
import UsersReport from '../../components/UsersReport/UsersReport';
import styles from './Admin.module.css';

function Admin() {
  return (
    <>
      <section className={styles.left}>
        <Sidebar />
      </section>
      <section className={styles.right}>
        <UsersReport />
      </section>
    </>
  );
}

export default Admin;
