import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import styles from './Sidebar.module.css';

function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const resetUser = useUserStore((state) => state.resetUser);

  async function handleLogout() {
    try {
      await logout();
      resetUser();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err);
    }
  }

  return (
    <div className={styles.sidebar}>
      <header>Exclusive</header>
      <nav>
        <ul>
          <li>
            <button>
              <i className="fa-solid fa-chart-pie w-5"></i> Dashborad
            </button>
          </li>
          <li>
            <button>
              <i className="fa-solid fa-user"></i> Users
            </button>
          </li>
          <li>
            <button>
              <i className="fa-solid fa-box"></i> Products
            </button>
          </li>
          <li>
            <button>
              <i className="fa-regular fa-copyright"></i> Brands
            </button>
          </li>
          <li>
            <button>
              <i className="fa-solid fa-icons"></i> Catagory
            </button>
          </li>
        </ul>
      </nav>
      <footer>
        <div>AD</div>
        <div>
          <div>Admin</div>
          <div>Hello Admin</div>
        </div>
        <button onClick={handleLogout}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </footer>
    </div>
  );
}

export default Sidebar;
