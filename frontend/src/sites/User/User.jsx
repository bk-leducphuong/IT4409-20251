import Navbar from '../../components/Navbar/Navbar';
import OrderDetail from '../../components/OrderDetail/OrderDetail';
import UserDetail from '../../components/UserDetail/UserDetail';
import Footer from '../../components/Footer/Footer';

function User() {
  return (
    <>
      <Navbar />
      <UserDetail />
      <OrderDetail />
      <Footer />
    </>
  );
}

export default User;
