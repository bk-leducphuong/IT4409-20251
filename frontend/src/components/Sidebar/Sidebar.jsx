import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import styles from './Sidebar.module.css';

function Sidebar({ setState }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const resetUser = useUserStore((state) => state.resetUser);
  const userData = useUserStore((state) => state.data);

  async function handleLogout() {
    resetUser();
    navigate('/');
    toast.success('Logged out successfully');
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={styles.sidebar}>
      <header>Exclusive</header>
      <nav>
        <ul>
          <li>
            <button onClick={() => setState('dashboard')}>
              <i className="fa-solid fa-chart-pie w-5"></i> Dashborad
            </button>
          </li>
          <li>
            <button onClick={() => setState('users')}>
              <i className="fa-solid fa-user"></i> Users
            </button>
          </li>
          <li>
            <button onClick={() => setState('orders')}>
              <i className="fa-solid fa-basket-shopping"></i> Orders
            </button>
          </li>
          <li>
            <button onClick={() => setState('coupons')}>
              <i className="fa-solid fa-tags"></i> Coupons
            </button>
          </li>
          <li>
            <button onClick={() => setState('products')}>
              <i className="fa-solid fa-box"></i> Products
            </button>
          </li>
          <li>
            <button onClick={() => setState('brands')}>
              <i className="fa-regular fa-copyright"></i> Brands
            </button>
          </li>
          <li>
            <button onClick={() => setState('categories')}>
              <i className="fa-solid fa-icons"></i> Catagories
            </button>
          </li>
        </ul>
      </nav>
      <footer>
        <div>
          <button onClick={() => navigate('/')}>Return to Shop</button>
        </div>
        <div>
          <div>AD</div>
          <div>
            <div>{userData.fullName}</div>
            <div>Hello Admin</div>
          </div>
          <button onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Sidebar;
