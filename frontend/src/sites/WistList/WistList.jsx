import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Shelf from '../../components/Shelf/Shelf';
import Card from '../../components/Card/Card';

function WistList() {
  return (
    <>
      <Navbar />
      <Shelf name="Wistlist (4)" buttonName="Move All To Bag">
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
      </Shelf>
      <Shelf name="Just For You" buttonName="See All">
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
        <Card productName="HAVIT HV-G92 Gamepad" oldPrice="160" newPrice="120" rating="4" />
      </Shelf>
      <Footer />
    </>
  );
}

export default WistList;
