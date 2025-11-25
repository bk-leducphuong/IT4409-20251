import styles from './Statistic.module.css';

function StatisticCard({ icon, number, text }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.number}>{number}</div>
      <div>{text}</div>
    </div>
  );
}

function Statistic() {
  return (
    <div className={styles.container}>
      <StatisticCard
        key={1}
        icon={<i className="fa-solid fa-store"></i>}
        number={'10.5k'}
        text={'Sallers active our site'}
      />
      <StatisticCard
        key={2}
        icon={<i className="fa-solid fa-dollar-sign"></i>}
        number={'33k'}
        text={'Monthly product sale'}
      />
      <StatisticCard
        key={3}
        icon={<i className="fa-solid fa-bag-shopping"></i>}
        number={'44.5k'}
        text={'Customer active on our site'}
      />
      <StatisticCard
        key={4}
        icon={<i className="fa-solid fa-sack-dollar"></i>}
        number={'25k'}
        text={'Anual gross sale in our site'}
      />
    </div>
  );
}

export default Statistic;
