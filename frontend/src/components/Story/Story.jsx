import styles from './Story.module.css';

function Story() {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1>Our story</h1>
        <p>
          Launced in 2015, Exclusive is South Asia&apos;s premier online shopping marketplace with
          an active presense in Bangladesh. Supported by wide range of tailored marketing, data and
          service solutions, Exclusive has 10,500 sallers and 300 brands serves 3 millions customers
          across the region.
        </p>
        <p>
          Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive
          offers a diverse assotment in categories ranging from consumer.
        </p>
      </div>
      <div className={styles.right}>
        <img
          src="https://static.vecteezy.com/system/resources/previews/028/559/544/non_2x/online-shopping-concept-free-photo.jpg"
          alt="Decoration"
        />
      </div>
    </div>
  );
}

export default Story;
