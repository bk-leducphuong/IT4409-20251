import { useEffect, useState } from 'react';
import styles from './UsersReport.module.css';

function UsersReport() {
  const [name, setName] = useState('');
  const [users, setUsers] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('users.json');
        const data = await res.json();
        setUsers(data.data.users);
        console.log('Fetched users sucessfully!');
      } catch (error) {
        console.log(error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className={styles.usersReport}>
      <header>
        <div>
          <h1>Quản lý người dùng</h1>
          <p>Quản lý truy cập, vai trò và trạng thái tài khoản người dùng.</p>
        </div>
        <button className={styles.blackBtn}>+ Thêm người dùng mới</button>
      </header>

      <main>
        <div>
          <input
            placeholder="Tìm kiếm"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className={styles.buttonsContainer}>
            <button>
              <i className="fa-solid fa-magnifying-glass"></i>Tìm kiếm
            </button>
            <button>
              <i className="fa-solid fa-arrows-rotate"></i>Làm mới
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Sđt</th>
              <th>Trạng thái</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className={styles.avatar}>
                      <img src={user.avatar} alt="avatar" />
                      <span>
                        <div className={styles.name}>{user.fullName}</div>
                        <div className={styles.email}>{user.email}</div>
                      </span>
                    </div>
                  </td>
                  <td>{user.phone}</td>
                  <td>{user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</td>
                  <td>{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</td>
                  <td>
                    <div className={styles.buttonsContainer}>
                      <button>Sửa</button>
                      <button className={styles.redBtn}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default UsersReport;
