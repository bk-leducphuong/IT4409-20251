import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import styles from './SignUpForm.module.css';

function SignUpForm({ toggleState = () => console.log('button clicked') }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);
  const loadUserData = useUserStore((state) => state.loadUserData);

  const componentSignUp = async () => {
    try {
      await signUp(name, email, password, phoneNumber);
      await loadUserData();
      navigate('/');
    } catch (err) {
      alert(err);
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
        <button
          className={styles.submitButton}
          onClick={(e) => {
            e.preventDefault();
            componentSignUp();
          }}
        >
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
