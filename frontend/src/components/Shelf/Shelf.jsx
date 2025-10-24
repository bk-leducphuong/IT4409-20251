import styles from "./Shelf.module.css";

function Shelf(props) {
    
    return (
        <div className={styles.shelfContainer}>
            <div className={styles.header}>

                <div className={styles.topic}>{props.topic}</div>
                
                <div className={styles.name}>
                    {props.name}
                    <div className={styles.buttonContainer}>
                        <button className={styles.button}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className={styles.button}>
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>

            </div>

            <div className={styles.cardsContainer}>
                {props.children}
            </div>
        </div>
    );
}

export default Shelf;