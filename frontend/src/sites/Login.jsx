import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SignUpForm from "../components/SignUpForm/SignUpForm";
import LoginForm from "../components/LoginForm/LoginForm";
import Card from "../components/Card/Card";

function Login() {
    

    return (
        <>
            <Navbar />
            <LoginForm />
            <SignUpForm />
            <Card
                productName="HAVIT HV-G92 Gamepad"
                oldPrice="160"
                newPrice="120"
                rating="4"
            />
            <Footer />
        </>
    );
}

export default Login;