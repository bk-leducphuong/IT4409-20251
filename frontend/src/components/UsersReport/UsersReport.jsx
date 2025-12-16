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

  const [newUser, setNewUser] = useState(null);
  const createUser = useAdminStore((state) => state.createUser);

  const [deletingUser, setDeletingUser] = useState(null);
  const deleteUser = useAdminStore((state) => state.deleteUser);

  const [editingUser, setEditingUser] = useState(null);
  const updateUser = useAdminStore((state) => state.updateUser);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(20);

  async function fetchUsers() {
    try {
      const res = await getUsers(page);
      setUsers(res.data.users);
      setTotalPage(res.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function fetchAdmins() {
    try {
      const res = await getAdmins();
      setAdmins(res.data.admins);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleCreateUser() {
    try {
      await createUser(
        newUser.fullName,
        newUser.email,
        newUser.password,
        newUser.phone,
        newUser.address,
        newUser.status,
      );
      await fetchUsers();
      setNewUser(null);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleDeleteUser() {
    const userId = deletingUser._id;
    try {
      await deleteUser(userId);
      await fetchUsers();
      await fetchAdmins();
      setDeletingUser(null);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleUpdateUser() {
    try {
      await updateUser(editingUser._id, editingUser);
      await fetchUsers();
      await fetchAdmins();
      setEditingUser(null);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await fetchUsers();
        await fetchAdmins();
      } catch {
        // intentionally ignored
      }
    })();
  }, []);

  useEffect(() => {
    (async () => await fetchUsers())();
  }, [page]);

  return (
    <div className={styles.usersReport}>
      <header>
        <div>
          <h1>Users management</h1>
          <p>Manage access, roles and users status.</p>
        </div>
        <button
          onClick={() =>
            setNewUser({
              fullName: '',
              email: '',
              password: '',
              phone: '',
              address: '',
              status: 'active',
            })
          }
          className={styles.blackBtn}
        >
          + Add new user
        </button>
      </header>

      <main>
        <section>
          <div>
            <input
              placeholder="Find user"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className={styles.buttonsContainer}>
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>Find
              </button>
              <button onClick={fetchUsers}>
                <i className="fa-solid fa-arrows-rotate"></i>Refresh
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>State</th>
                <th>Role</th>
                <th>Actions</th>
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
                    <td>{user.status}</td>
                    <td>User</td>
                    <td>
                      <div className={styles.buttonsContainer}>
                        <button onClick={() => setEditingUser({ ...user })}>Edit</button>
                        <button className={styles.redBtn} onClick={() => setDeletingUser(user)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <div className={styles.buttonsContainer}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage((p) => p - 1);
                }}
              >
                &lt;
              </button>
              <span>
                {page} / {totalPage}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => p + 1);
                }}
              >
                &gt;
              </button>
            </div>
            <div>
              Users per page:
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(e.target.value);
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <div>
            <input
              placeholder="Find admin"
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
            <div className={styles.buttonsContainer}>
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>Find
              </button>
              <button onClick={fetchAdmins}>
                <i className="fa-solid fa-arrows-rotate"></i>Refresh
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>State</th>
                <th>Role</th>
                <th>Actions</th>
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
                    <td>{user.status}</td>
                    <td>Admin</td>
                    <td>
                      <div className={styles.buttonsContainer}>
                        <button onClick={() => setEditingUser({ ...user })}>Edit</button>
                        <button className={styles.redBtn} onClick={() => setDeletingUser(user)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </main>

      {newUser && (
        <div className={styles.confirmOverlay}>
          <div className={styles.form}>
            <h2>Create new user</h2>

            <div>
              <div>Name:</div>
              <input
                type="text"
                placeholder="Enter username"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              />
            </div>

            <div>
              <div>Password:</div>
              <input
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>

            <div>
              <div>Email:</div>
              <input
                type="email"
                placeholder="Enter user's email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>

            <div>
              <div>Phone Number:</div>
              <input
                type="text"
                placeholder="Enter user's phone number"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
            </div>

            <div>
              <div>Address:</div>
              <input
                type="text"
                placeholder="Enter user's address"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              />
            </div>

            <div>
              <div>State:</div>
              <select
                value={newUser.status || 'active'}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className={styles.buttonsContainer}>
              <button onClick={handleCreateUser}>Create user</button>
              <button onClick={() => setNewUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deletingUser && (
        <div className={styles.confirmOverlay}>
          <div>
            <h2>{`Are you sure you want to delete user ${deletingUser.fullName}?`}</h2>
            <div className={styles.buttonsContainer}>
              <button className={styles.redBtn} onClick={handleDeleteUser}>
                Delete
              </button>
              <button onClick={() => setDeletingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className={styles.confirmOverlay}>
          <div className={styles.form}>
            <h2>Update infomations</h2>

            <div>
              <div>Name:</div>
              <input
                type="text"
                placeholder="Enter username"
                value={editingUser.fullName}
                onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
              />
            </div>

            <div>
              <div>Email:</div>
              <input
                type="email"
                placeholder="Enter user's email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
            </div>

            <div>
              <div>Phone Number:</div>
              <input
                type="text"
                placeholder="Enter user's phone number"
                value={editingUser.phone}
                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
              />
            </div>

            <div>
              <div>Address:</div>
              <input
                type="text"
                placeholder="Enter user's address"
                value={editingUser.address}
                onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
              />
            </div>

            <div>
              <div>State:</div>
              <select
                value={editingUser.status}
                onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className={styles.buttonsContainer}>
              <button onClick={handleUpdateUser}>Save changes</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersReport;
