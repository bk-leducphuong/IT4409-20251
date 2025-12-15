import Sidebar from '../../components/Sidebar/Sidebar';
import UsersReport from '../../components/UsersReport/UsersReport';
import BrandReport from '../../components/BrandReport/BrandReport';
import CategoryReport from '../../components/CategoryReport/CategoryReport';
import ProductReport from '../../components/ProductReport/ProductReport';
import styles from './Admin.module.css';
import { useState } from 'react';

function Admin() {
  const [state, setState] = useState('users');

  return (
    <>
      <section className={styles.left}>
        <Sidebar setState={setState} />
      </section>
      <section className={styles.right}>
        {state === 'users' && <UsersReport />}
        {state === 'brands' && <BrandReport />}
        {state === 'categories' && <CategoryReport />}
        {state === 'products' && <ProductReport />}
      </section>
    </>
  );
}

export default Admin;
