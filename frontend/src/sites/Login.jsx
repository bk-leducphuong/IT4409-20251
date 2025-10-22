import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SignUpForm from "../components/SignUpForm/SignUpForm";
import LoginForm from "../components/LoginForm/LoginForm";

function Login() {
    

    return (
        <>
            <Navbar />
            <LoginForm />
            <SignUpForm />
            <Footer />
        </>
    );
}

export default Login;