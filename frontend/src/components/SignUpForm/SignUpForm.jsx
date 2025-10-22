import styles from "./SignUpForm.module.css";

function SignUpForm(){
    
    return (
        <div className={styles.signUpFromContainer}>
            <h1>Create an account</h1>
            <p>Enter your details below</p>
            <form action="" className={styles.form}>
                <input type="text" name="" placeholder="Name" required className={styles.input}/>
                <input type="text" name="" placeholder="Email or Phone Number" required className={styles.input}/>
                <input type="password" placeholder="Password" required className={styles.input}/>
                <button type="submit" className={styles.submitButton}>Create Account</button>
            </form>
            <button className={styles.googleButton}>
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google logo" className={styles.googleImage}/>
                Sign up with Google
            </button>
            <div className={styles.formFooter}>
                Already have account? <a href="#" className={styles.a}>Log in</a>
            </div>
        </div>
    );
}

export default SignUpForm;