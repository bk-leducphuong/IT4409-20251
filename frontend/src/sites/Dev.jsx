import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SignUpForm from "../components/SignUpForm/SignUpForm";
import LoginForm from "../components/LoginForm/LoginForm";
import Card from "../components/Card/Card";
import Shelf from "../components/Shelf/Shelf";
import Services from "../components/Services/Services";
import NotFound from "../components/NotFound/NotFound";
import Button from "../components/Button/Button";

function Dev() {
    const titles = [
        "Sinh vien Bach Khoa",
        "Biet the deo hoc Bach Khoa",
        "Mot tinh yeu mot tuong lai",
        "Sinh vien nam tam"
    ];

    const exampleCard = <Card
        productName="HAVIT HV-G92 Gamepad"
        oldPrice="160"
        newPrice="120"
        rating="4"
    />;

    return (
        <>
            <Navbar />

            <div style={{
                display:"flex",
                justifyContent:"space-around"
            }}>
                <LoginForm />
                <SignUpForm />
            </div>

            <Button onClick={() => {
                document.title = titles[Math.floor(Math.random() * titles.length)];
            }}>Example Button</Button>
            
            <Shelf
                name="Wistlist (4)"
                buttonName="Move All To Bag"
            >
                {[exampleCard, exampleCard, exampleCard, exampleCard]}
            </Shelf>

            <Shelf
                topic="Today"
                strong="Flash Sales"
            >
                {[exampleCard, exampleCard, exampleCard, exampleCard]}
            </Shelf>

            <NotFound />
            <Services />

            <Footer />
        </>
    );
}

export default Dev;