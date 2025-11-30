function ServiceCard(props) {
  const styles = {
    cardContainer: {
      display: "flex",
      flexDirection: "column",
      width: "32%",
      textAlign: "center",
      gap: "0.5rem",
      marginBottom: "2rem",
    },
    cardIconContainer: {
      marginBottom: "1rem",
    },
    cardIcon: {
      backgroundColor: "black",
      color: "white",
      padding: "1rem",
      borderRadius: "50%",
      border: "8px solid grey",
      width: "fit-content",
      aspectRatio: "1 / 1",
      fontSize: "1.5rem",
      alignSelf: "center",
      transition: "transform 0.25s",
    },
    cardTitle: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    cardDescription: {
      fontSize: "1rem",
    },
  };

  return (
    <div style={styles.cardContainer}>
      <div style={styles.cardIconContainer}>
        <i className={props.iconClassName} style={styles.cardIcon}></i>
      </div>

      <div style={styles.cardTitle}>{props.title}</div>
      <div style={styles.cardDescription}>{props.description}</div>
    </div>
  );
}

function Services() {
  const containerStyles = {
    display: "flex",
    justifyContent: "space-around",
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  return (
    <div style={containerStyles}>
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
        title="money back guarantee"
        description="We return money within 30 days"
      />
    </div>
  );
}

export default Services;
