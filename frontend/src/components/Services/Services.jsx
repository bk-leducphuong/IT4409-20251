import styles from "./Services.module.css";

function ServiceCard(props) {

    return (
        <div className={styles.cardContainer}>
            <div className={styles.cardIconContainer}>
                <i className={`${props.iconClassName} ${styles.cardIcon}`}></i>
            </div>

            <div className={styles.cardTitle}>
                {props.title}
            </div>

            <div className={styles.cardDescription}>
                {props.description}
            </div>
        </div>
    );
}

function Services() {

    return (
        <div className={styles.servicesContainer}>
            <ServiceCard
                iconClassName="fa-solid fa-truck-fast"
                title="free and fast delivery"
                description="Free delivery for all orders over $140"
            />
            <ServiceCard
                iconClassName="fa-solid fa-headphones"
                title="24/7 customer service"
                description="Friendly 24/7 customer support"
            />
            <ServiceCard
                iconClassName="fa-solid fa-check"
                title="money back quarantee"
                description="We reurn money within 30 days"
            />
        </div>
    );
}

export default Services;