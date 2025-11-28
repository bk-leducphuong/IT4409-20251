import Button from '../Button/Button';
import { useEffect, useState, Children } from 'react';
import styles from './Shelf.module.css';

function Shelf({
  topic,
  strong,
  name,
  buttonName,
  children,
  onClick = () => console.log('button clicked'),
}) {
  const data = Children.toArray(children);
  const [index, setIndex] = useState(0);

  return (
    <div className={styles.shelfContainer}>
      <div className={styles.header}>
        {topic && <div className={styles.topic}>{topic}</div>}

        <div className={styles.info}>
          {strong && <div className={styles.strong}>{strong}</div>}
          {name && <div className={styles.name}>{name}</div>}

          <div className={styles.buttonContainer}>
            {data.length > 4 && (
              <>
                <button
                  className={styles.button}
                  onClick={(e) => {
                    e.preventDefault();
                    if (index > 0) setIndex((i) => i - 1);
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button
                  className={styles.button}
                  onClick={(e) => {
                    e.preventDefault();
                    if (index + 4 < data.length) setIndex((i) => i + 1);
                  }}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </>
            )}
            {buttonName && (
              <Button backgroundColor="white" onClick={onClick}>
                {buttonName}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.cardsContainer}>{data.slice(index, index + 4)}</div>
    </div>
  );
}

export default Shelf;
