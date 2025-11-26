import styles from './Sidebar.module.css';

function Sidebar() {
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
              <i className="fa-solid fa-user"></i> Products
            </button>
          </li>
          <li>
            <button>
              <i className="fa-solid fa-user"></i> Brands
            </button>
          </li>
          <li>
            <button>
              <i className="fa-solid fa-user"></i> Catagory
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
        <button>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </footer>
    </div>
  );
}

export default Sidebar;
