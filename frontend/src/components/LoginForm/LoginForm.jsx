import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import styles from './LoginForm.module.css';

function LoginForm({ toggleState = () => console.log('button clicked') }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((store) => store.login);

  const componentLogin = async () => {
    try {
      login(email, password);
      navigate('/');
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
        <button className={styles.submitButton} onClick={componentLogin}>
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
