import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import styles from './LoginForm.module.css';

function LoginForm({ toggleState = () => console.log('button clicked') }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loadUserData = useUserStore((state) => state.loadUserData);

  const componentLogin = async () => {
    try {
      await login(email, password);
      await loadUserData();
      toast.success('Login successful');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
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
        <button
          className={styles.submitButton}
          onClick={(e) => {
            e.preventDefault();
            componentLogin();
          }}
        >
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
        <button className={styles.a} onClick={() => navigate('/forgot-password')}>
          Forgot password?
        </button>
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
