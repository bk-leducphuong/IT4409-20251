import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import SignUpForm from '../components/SignUpForm/SignUpForm';
import LoginForm from '../components/LoginForm/LoginForm';
import Card from '../components/Card/Card';
import Shelf from '../components/Shelf/Shelf';
import Services from '../components/Services/Services';
import NotFound from '../components/NotFound/NotFound';
import Button from '../components/Button/Button';
import Loading from '../components/Loading/Loading';
import Story from '../components/Story/Story';
import Statistic from '../components/Statistic/Statistic';
import Founder from '../components/Founder/Founder';
import Admin from './Admin/Admin';
import { useEffect, useState } from 'react';

function Dev() {
  const [isLoading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 10000);

  const titles = [
    'Sinh vien Bach Khoa',
    'Biet the deo hoc Bach Khoa',
    'Mot tinh yeu mot tuong lai',
    'Sinh vien nam tam',
  ];

  const exampleCard = (
    <Card
      image="https://th.bing.com/th/id/R.8d1e0199c5ebe4fab3e5fee28aa0dbda?rik=sQ7TrFvVmvzNzA&pid=ImgRaw&r=0"
      productName="HAVIT HV-G92 Gamepad"
      oldPrice="160"
      newPrice="120"
      rating="4"
    />
  );

  const [qr, setOr] = useState(null);

  useEffect(() => {
    fetch('qr.json')
      .then((res) => res.json())
      .then((data) => setOr(data.qr))
      .catch(() => {});
  }, []);

  if (qr)
    return (
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          {qr && (
            <img
              src={qr}
              alt="QR Code"
              style={{
                aspectRatio: '1 / 1',
                height: '50vh',
              }}
            />
          )}
          <Button>Check Payment Result</Button>
        </div>
      </div>
    );

  return (
    <>
      {/* <Admin /> */}
      <Navbar />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <LoginForm />
        <SignUpForm />
      </div>

      <Button
        onClick={() => {
          document.title = titles[Math.floor(Math.random() * titles.length)];
        }}
      >
        Example Button
      </Button>

      <Shelf name="Wistlist (4)" buttonName="Move All To Bag">
        {[exampleCard, exampleCard, exampleCard, exampleCard]}
      </Shelf>

      <Shelf topic="Today" strong="Flash Sales">
        {[exampleCard, exampleCard, exampleCard, exampleCard]}
      </Shelf>

      <NotFound />

      <Story />
      <Statistic />
      <Founder />
      <Services />

      <Footer />

      <Loading isLoading={isLoading} />
    </>
  );
}

export default Dev;
