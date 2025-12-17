import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import LoginForm from '../../components/LoginForm/LoginForm';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { getPreviousSite, clearPreviousSite } from '../../libs/storage';
import styles from './Login.module.css';

function Login() {
  const userData = useUserStore((state) => state.data);
  const navigate = useNavigate();

  const [state, setState] = useState('sign up');

  function toggleState() {
    if (state === 'login') setState('sign up');
    else setState('login');
  }

  useEffect(() => {
    if (!userData) return;

    const previousSite = getPreviousSite();

    if (previousSite) {
      clearPreviousSite();
      navigate(previousSite, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [userData]);

  return (
    <>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.imageContainer}>
          <img
            src="https://static.vecteezy.com/system/resources/previews/028/559/544/non_2x/online-shopping-concept-free-photo.jpg"
            alt="decorate"
            className={styles.image}
          />
        </div>
        <div className={styles.formContainer}>
          {state === 'login' ? (
            <LoginForm toggleState={toggleState} />
          ) : (
            <SignUpForm toggleState={toggleState} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
