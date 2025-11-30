import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import styles from './User.module.css';
import { useUserStore } from '../../stores/userStore';
import { useState } from 'react';

function User() {
  const userData = useUserStore((state) => state.data);
  const loadUserData = useUserStore((state) => state.loadUserData);
  const changePassword = useUserStore((state) => state.changePassword);
  const updateUser = useUserStore((state) => state.updateUser);

  const [fullName, setFullName] = useState(userData.fullName);
  const [phone, setPhone] = useState(userData.phone);
  const [email, setEmail] = useState(userData.email);
  const [address, setAddress] = useState(userData.address);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  function cancel() {
    setFullName(userData.fullName);
    setPhone(userData.phone);
    setEmail(userData.email);
    setAddress(userData.address);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  }

  async function componentSubmit() {
    try {
      let res1 = null,
        res2 = null;
      if (
        (currentPassword || newPassword || confirmNewPassword) &&
        newPassword === confirmNewPassword
      )
        res1 = changePassword(currentPassword, newPassword);

      if (
        fullName != userData?.fullName ||
        phone != userData?.phone ||
        email != userData?.email ||
        address != userData?.address
      )
        res2 = updateUser({ fullName, phone, email, address });

      await Promise.all([res1, res2]);
      await loadUserData();
    } catch (err) {
      console.error(err);
      alert(err);
      cancel();
    }
  }

  return (
    <>
      <Navbar />

      <div className={styles.user}>
        <h2>Edit Your Profile</h2>

        <div className={styles.grid}>
          <div>
            <div className={styles.label}>Full Name</div>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <div className={styles.label}>Phone Number</div>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <div className={styles.label}>Email</div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className={styles.label}>Address</div>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.label}>Password Changes</div>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />

        <div className={styles.btnContainer}>
          <Button
            backgroundColor="white"
            onClick={(e) => {
              e.preventDefault();
              cancel();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              componentSubmit();
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default User;
