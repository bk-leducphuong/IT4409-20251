import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <header>Exclusive</header>
      <nav>
        <ul>
          <li>
            <button>
              <i className="fa-solid fa-chart-pie w-5"></i> Bảng điều khiển
            </button>
          </li>
          <li>
            <button>
              <i className="fa-solid fa-user"></i> Người dùng
            </button>
          </li>
        </ul>
      </nav>
      <footer>
        <div>AD</div>
        <div>
          <div>Quản trị viên</div>
          <div>Xin chào Admin</div>
        </div>
        <button>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </footer>
    </div>
  );
}

export default Sidebar;
