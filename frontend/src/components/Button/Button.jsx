import styles from "./Button.module.css";

function Button(props) {

    const style = 
    (!props.backgroundColor || props.backgroundColor.toLowerCase() === "red") ?
    styles.red : styles.white;

    return (
        <button className={style} onClick={props.onClick || (() => {console.log("button clicked")})}>
            {props.children}
        </button>
    );
}

export default Button;