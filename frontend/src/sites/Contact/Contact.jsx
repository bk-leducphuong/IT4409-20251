import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import styles from './Contact.module.css';

function Contact() {
  return (
    <>
      <Navbar />

      <div className={styles.wrapper}>
        <section className={styles.left}>
          <div className={styles.icon}>
            <i className="fa-solid fa-phone"></i>
            Call To Us
          </div>
          <div>We are available 24/7, 7 days a week</div>
          <div>Phone: +8801611112222</div>
          <hr />
          <div className={styles.icon}>
            <i className="fa-solid fa-envelope"></i>
            Write to us
          </div>
          <div>Fill out form and we will contact you within 24 hours</div>
          <div>Emails: customer@exclusive.com</div>
          <div>Emails: support@exclusive.com</div>
        </section>

        <section className={styles.right}>
          <div className={styles.inputContainer}>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <input type="text" placeholder="Your Phone" />
          </div>
          <div>
            <textarea placeholder="Your Massage" />
          </div>
          <div className={styles.buttonContainer}>
            <Button>Send Massage</Button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Contact;
