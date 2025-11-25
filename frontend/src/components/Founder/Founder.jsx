import styles from './Founder.module.css';

function FounderCard({ image, name, position }) {
  return (
    <div className={styles.founderCard}>
      <div className={styles.imageContainer}>
        <img src={image} alt={name} />
      </div>
      <div className={styles.name}>{name}</div>
      <div className={styles.position}>{position}</div>
      <div className={styles.iconsContainer}>
        <i className="fa-brands fa-twitter"></i>
        <i className="fa-brands fa-instagram"></i>
        <i className="fa-brands fa-linkedin-in"></i>
      </div>
    </div>
  );
}

function Founder() {
  return (
    <div className={styles.container}>
      <FounderCard
        key={1}
        image="https://img.freepik.com/premium-photo/businessman-isolatedxa_115919-38770.jpg"
        name="Tom Cruise"
        position="Founder & Chairman"
      />
      <FounderCard
        key={2}
        image="https://img.freepik.com/premium-photo/businessman-isolatedxa_115919-38770.jpg"
        name="Emma Watson"
        position="Managing Director"
      />
      <FounderCard
        key={3}
        image="https://img.freepik.com/premium-photo/businessman-isolatedxa_115919-38770.jpg"
        name="Will Smith"
        position="Product Designer"
      />
    </div>
  );
}

export default Founder;
