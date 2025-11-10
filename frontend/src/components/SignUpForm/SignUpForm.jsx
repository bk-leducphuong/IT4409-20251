import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignUpForm.module.css';

function SignUpForm({
  toggleState = () => console.log('button clicked'),
  setToken = () => console.log('button clicked'),
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signUp = async () => {
    try {
      if (!phoneNumber || !email || !password) {
        alert('Hãy nhập các mục yêu cầu!');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Hãy nhập Email hợp lệ!');
        setPassword('');
        return;
      }

      if (!/^[0-9]{10,}$/.test(phoneNumber)) {
        alert('Hãy nhập số điện thoại hợp lệ! Gồm 10 chữ số!');
        setPassword('');
        return;
      }

      if (!/^[a-zA-Z0-9]{8,}$/.test(password)) {
        alert('Mật khẩu cần có ít nhất 8 kí tự bao gồm cả chữ cái và chữ số!');
        setPassword('');
        return;
      }

      const token = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          phone: phoneNumber,
        }),
      }).then((res) => res.json());

      if (token.success) {
        setToken(token.data.token);
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        navigate('/');
      } else {
        alert(token.message);
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
      }
    } catch (err) {
      alert('Có lỗi xảy ra trong quá trình đăng nhập! Vui lòng thử lại.');
      console.error(err);
      setPassword('');
    }
  };

  return (
    <div className={styles.signUpFromContainer}>
      <h1>Create an account</h1>
      <p>Enter your details below</p>
      <form className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          className={styles.input}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          className={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          required
          className={styles.input}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.submitButton} onClick={signUp}>
          Create Account
        </button>
      </form>
      <button className={styles.googleButton}>
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google logo"
          className={styles.googleImage}
        />
        Sign up with Google
      </button>
      <div className={styles.formFooter}>
        Already have account?{' '}
        <button
          className={styles.a}
          onClick={(e) => {
            e.preventDefault();
            toggleState();
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );
}

export default SignUpForm;
