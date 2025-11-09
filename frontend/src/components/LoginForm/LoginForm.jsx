import styles from './LoginForm.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm({
  toggleState = () => console.log('button clicked'),
  setToken = () => console.log('button clicked'),
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      if (!email || !password) {
        alert('Hãy nhập các mục yêu cầu!');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Hãy nhập Email hợp lệ!');
        setPassword('');
        return;
      }

      if (!/^[a-zA-Z0-9]{8,}$/.test(password)) {
        alert('Mật khẩu cần có ít nhất 8 kí tự bao gồm cả chữ cái và chữ số!');
        setPassword('');
        return;
      }

      const token = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then((res) => res.json());

      if (token.success) {
        setToken(token.data.token);
        setEmail('');
        setPassword('');
        navigate('/');
      } else {
        alert(token.message);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      alert('Có lỗi xảy ra trong quá trình đăng nhập! Vui lòng thử lại.');
      console.error(err);
      setPassword('');
    }
  };

  return (
    <div className={styles.loginFromContainer}>
      <h1>Login your account</h1>
      <p>Enter your details below</p>
      <form className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          className={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          className={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.submitButton} onClick={login}>
          Login
        </button>
      </form>
      <button className={styles.googleButton}>
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google logo"
          className={styles.googleImage}
        />
        Login with Google
      </button>
      <div className={styles.formOptions}>
        <label htmlFor="">
          <input type="checkbox" className={styles.checkBox} />
          Remember me
        </label>
        <button className={styles.a}>Forgot password?</button>
      </div>
      <div className={styles.formFooter}>
        Don&apos;t have an account?{' '}
        <button
          className={styles.a}
          onClick={(e) => {
            e.preventDefault();
            toggleState();
          }}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
