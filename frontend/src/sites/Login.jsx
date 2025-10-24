import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SignUpForm from "../components/SignUpForm/SignUpForm";
import LoginForm from "../components/LoginForm/LoginForm";
import Card from "../components/Card/Card";
import Shelf from "../components/Shelf/Shelf";

function Login() {
    

    return (
        <>
            <Navbar />
            <Shelf
                topic="Today's"
                name="Flash Sales"
            >
                <Card
                    productName="HAVIT HV-G92 Gamepad"
                    oldPrice="160"
                    newPrice="120"
                    rating="4"
                />
                <Card
                    productName="HAVIT HV-G92 Gamepad"
                    oldPrice="160"
                    newPrice="120"
                    rating="4"
                />
                <Card
                    productName="HAVIT HV-G92 Gamepad"
                    oldPrice="160"
                    newPrice="120"
                    rating="4"
                />
                <Card
                    productName="HAVIT HV-G92 Gamepad"
                    oldPrice="160"
                    newPrice="120"
                    rating="4"
                />
            </Shelf>
            <Footer />
        </>
    );
}

export default Login;