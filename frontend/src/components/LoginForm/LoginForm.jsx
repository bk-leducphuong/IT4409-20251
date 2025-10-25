import styles from "./LoginForm.module.css";

function LoginForm(props) {
    
    return (
        <div className={styles.loginFromContainer}>
            <h1>Login your account</h1>
            <p>Enter your details below</p>
            <form action="" className={styles.form}>
                <input type="text" name="" placeholder="Name" required className={styles.input}/>
                <input type="password" placeholder="Password" required className={styles.input}/>
                <button type="submit" className={styles.submitButton}>Login</button>
            </form>
            <button className={styles.googleButton}>
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google logo" className={styles.googleImage}/>
                Login with Google
            </button>
            <div className={styles.formOptions}>
                <label htmlFor=""><input type="checkbox" className={styles.checkBox}/>Remember me</label>
                <a href="#" className={styles.a}>Forgot password?</a>
            </div>
            <div className={styles.formFooter}>
                Don't have an account? <a href="#" className={styles.a} onClick={(e) => {e.preventDefault(); props.toggleState();}}>Sign up</a>
            </div>
        </div>
    );
}

export default LoginForm;