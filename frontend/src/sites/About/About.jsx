import Navbar from '../../components/Navbar/Navbar';
import Story from '../../components/Story/Story';
import Statistic from '../../components/Statistic/Statistic';
import Founder from '../../components/Founder/Founder';
import Services from '../../components/Services/Services';
import Footer from '../../components/Footer/Footer';
import styles from './About.module.css';

function About() {
  return (
    <>
      <Navbar />
      <div className={styles.main}>
        <Story />
        <Statistic />
        <Founder />
        <Services />
      </div>
      <Footer />
    </>
  );
}

export default About;
