import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import LoginForm from "../../components/LoginForm/LoginForm";
import styles from './Login.module.css';
import { useState } from "react";

function Login() {
    
    const [state, changeState] = useState("login");

    function toggleState() {
        if(state === "login") changeState("sign up");
        else changeState("login");
    }

    return (
        <>
            <Navbar />
            <div className={styles.main}>
                <div className={styles.imageContainer}>
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/028/559/544/non_2x/online-shopping-concept-free-photo.jpg"
                        alt="decorate image"
                        className={styles.image}/>
                </div>
                <div className={styles.formContainer}>
                    {state === "login" ? <LoginForm toggleState={toggleState} /> : <SignUpForm toggleState={toggleState} />}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Login;