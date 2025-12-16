import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import styles from './ForgotPassword.module.css';

export default function ForgotPassword() {
  const [step, setStep] = useState('enterEmail'); // enterEmail | enterOTP | resetPassword | success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const token = useRef('');

  const sendOtp = useAuthStore((state) => state.sendOtp);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  async function handleSendOtp(e) {
    e?.preventDefault();
    try {
      const res = await sendOtp(email);
      if (res.success) setStep('enterOTP');
      else throw new Error(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleVerifyOtp(e) {
    e?.preventDefault();
    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        // OTP matched
        token.current = res.data.resetSessionToken;
        setStep('resetPassword');
        // clear otp for security
        setOtp('');
      } else throw new Error(res.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleResetPassword(e) {
    e?.preventDefault();
    try {
      const res = await resetPassword(token.current, password, confirm);
      if (res.success) {
        setStep('success');
        // clear password for security
        setPassword('');
        setConfirm('');
      } else throw new Error(res.message);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  function handleBackToEmail() {
    setStep('enterEmail');
    setOtp('');
  }

  return (
    <div className={styles.page}>
      <div className={styles.container} role="main" aria-labelledby="title">
        <header className={styles.header}>
          <h1 id="title">Forgot Password</h1>
          <p className={styles.subtitle}>Reset your account password — quick & secure</p>
        </header>

        <div className={styles.card}>
          <div className={styles.progress}>
            <div className={`${styles.step} ${step === 'enterEmail' ? styles.active : ''}`}>1</div>
            <div className={`${styles.sep}`} />
            <div className={`${styles.step} ${step === 'enterOTP' ? styles.active : ''}`}>2</div>
            <div className={`${styles.sep}`} />
            <div className={`${styles.step} ${step === 'resetPassword' ? styles.active : ''}`}>
              3
            </div>
          </div>

          {step === 'enterOTP' && (
            <div className={styles.notice} role="status" aria-live="polite">
              OTP resent to: <strong>{email}</strong>. Please check your Gmail.
            </div>
          )}
          {step === 'resetPassword' && (
            <div className={styles.notice} role="status" aria-live="polite">
              OTP verified. Please choose a new password.
            </div>
          )}

          {step === 'enterEmail' && (
            <form onSubmit={handleSendOtp} className={styles.form}>
              <label className={styles.label}>
                Enter your Gmail
                <input
                  type="email"
                  inputMode="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  autoComplete="email"
                />
              </label>

              <div className={styles.actions}>
                <button type="submit" className={styles.primary} disabled={loading}>
                  {loading ? <span className={styles.spinner} aria-hidden="true" /> : 'Send OTP'}
                </button>
              </div>
            </form>
          )}

          {step === 'enterOTP' && (
            <form onSubmit={handleVerifyOtp} className={styles.form}>
              <label className={styles.label}>
                Enter OTP
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className={styles.input}
                  maxLength={6}
                />
              </label>

              <div className={styles.smallRow}>
                <button
                  type="button"
                  className={styles.ghost}
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </button>

                <button type="button" className={styles.ghost} onClick={handleBackToEmail}>
                  Change email
                </button>
              </div>

              <div className={styles.actions}>
                <button type="submit" className={styles.primary} disabled={loading}>
                  {loading ? <span className={styles.spinner} aria-hidden="true" /> : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}

          {step === 'resetPassword' && (
            <form onSubmit={handleResetPassword} className={styles.form}>
              <label className={styles.label}>
                New password
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  autoComplete="new-password"
                />
              </label>

              <label className={styles.label}>
                Confirm new password
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={styles.input}
                  autoComplete="new-password"
                />
              </label>

              <div className={styles.actions}>
                <button type="submit" className={styles.primary} disabled={loading}>
                  {loading ? (
                    <span className={styles.spinner} aria-hidden="true" />
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className={styles.successWrap}>
              <div className={styles.successIcon} aria-hidden="true">
                ✓
              </div>
              <h2 className={styles.successTitle}>Password changed</h2>
              <p className={styles.successText}>
                Your password was updated successfully. You can now sign in with your new password.
              </p>
              <div className={styles.actions}>
                <button
                  className={styles.primary}
                  onClick={() => navigate('/login', { replace: true })}
                >
                  Go to Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
