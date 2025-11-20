import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Admin.module.css';

function Admin() {
  return (
    <>
      <section className={styles.left}>
        <Sidebar />
      </section>
      <section className={styles.right}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat deserunt necessitatibus
        dolores omnis architecto assumenda fuga perferendis libero veniam. Ducimus temporibus iste,
        cupiditate dolores id nulla deserunt. Enim, tenetur voluptatibus.
      </section>
    </>
  );
}

export default Admin;
