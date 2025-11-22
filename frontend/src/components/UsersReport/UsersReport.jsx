import { useEffect, useState } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import styles from './UsersReport.module.css';

function UsersReport() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState(null);
  const getUsers = useAdminStore((state) => state.getUsers);

  const [adminName, setAdminName] = useState('');
  const [admins, setAdmins] = useState(null);
  const getAdmins = useAdminStore((state) => state.getAdmins);

  const [deletingUser, setDeletingUser] = useState(null);
  const deleteUser = useAdminStore((state) => state.deleteUser);

  const [editingUser, setEditingUser] = useState(null);
  const updateUser = useAdminStore((state) => state.updateUser);

  async function fetchUsers() {
    try {
      const res = await getUsers();
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchAdmins() {
    try {
      const res = await getAdmins();
      setAdmins(res.data.admins);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteUser() {
    const userId = deletingUser._id;
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u._id != userId));
      setAdmins(admins.filter((a) => a._id != userId));
      setDeletingUser(null);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleUpdateUser() {
    try {
      await updateUser(editingUser._id, editingUser);
      setEditingUser(null);
      await fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchUsers();
      await fetchAdmins();
    })();
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
        <section>
          <div>
            <input
              placeholder="Tìm kiếm người dùng"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className={styles.buttonsContainer}>
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>Tìm kiếm
              </button>
              <button onClick={fetchUsers}>
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
                    <td>Người dùng</td>
                    <td>
                      <div className={styles.buttonsContainer}>
                        <button onClick={() => setEditingUser({ ...user })}>Sửa</button>
                        <button className={styles.redBtn} onClick={() => setDeletingUser(user)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        <section>
          <div>
            <input
              placeholder="Tìm kiếm người quản trị"
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
            <div className={styles.buttonsContainer}>
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>Tìm kiếm
              </button>
              <button onClick={fetchAdmins}>
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
              {admins &&
                admins.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className={styles.avatar}>
                        <div>{user.fullName.slice(0, 2)}</div>
                        <span>
                          <div className={styles.name}>{user.fullName}</div>
                          <div className={styles.email}>{user.email}</div>
                        </span>
                      </div>
                    </td>
                    <td>{user.phone}</td>
                    <td>{user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</td>
                    <td>Quản trị viên</td>
                    <td>
                      <div className={styles.buttonsContainer}>
                        <button onClick={() => setEditingUser({ ...user })}>Sửa</button>
                        <button className={styles.redBtn} onClick={() => setDeletingUser(user)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </main>

      {deletingUser && (
        <div className={styles.confirmOverlay}>
          <div>
            <h2>{`Xác nhận xóa người dùng ${deletingUser.fullName}?`}</h2>
            <div className={styles.buttonsContainer}>
              <button className={styles.redBtn} onClick={handleDeleteUser}>
                Xóa
              </button>
              <button onClick={() => setDeletingUser(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className={styles.confirmOverlay}>
          <div className={styles.form}>
            <h2>Cập nhật thông tin</h2>

            <div>
              <div>Tên:</div>
              <input
                type="text"
                placeholder="Nhập tên người dùng"
                value={editingUser.fullName}
                onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
              />
            </div>

            <div>
              <div>Gmail:</div>
              <input
                type="email"
                placeholder="Nhập email người dùng"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
            </div>

            <div>
              <div>Sđt:</div>
              <input
                type="text"
                placeholder="Nhập sđt người dùng"
                value={editingUser.phone}
                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
              />
            </div>

            <div>
              <div>Địa chỉ:</div>
              <input
                type="text"
                placeholder="Nhập địa chỉ người dùng"
                value={editingUser.address}
                onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
              />
            </div>

            <div>
              <div>Trạng thái:</div>
              <input
                type="text"
                placeholder="Nhập tên người dùng"
                value={editingUser.status}
                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
              />
            </div>

            <div className={styles.buttonsContainer}>
              <button onClick={handleUpdateUser}>Lưu thay đổi</button>
              <button onClick={() => setEditingUser(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersReport;
