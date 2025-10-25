import Button from "../Button/Button";
import styles from "./Shelf.module.css";

function Shelf(props) {
    
    return (
        <div className={styles.shelfContainer}>
            <div className={styles.header}>

                {props.topic ? <div className={styles.topic}>{props.topic}</div> : null}
                
                <div className={styles.info}>
                    {props.strong ? <div className={styles.strong}>{props.strong}</div> : null}
                    {props.name ? <div className={styles.name}>{props.name}</div> : null}

                    {
                        props.buttonName
                        ?
                        <Button backgroundColor="white">{props.buttonName}</Button>
                        :
                        <div className={styles.buttonContainer}>
                            <button className={styles.button}>
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <button className={styles.button}>
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    }
                </div>

            </div>

            <div className={styles.cardsContainer}>
                {props.children}
            </div>
        </div>
    );
}

export default Shelf;