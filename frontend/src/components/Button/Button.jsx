import styles from './Button.module.css';

function Button({ backgroundColor, children, onClick = () => console.log('button clicked') }) {
  const style =
    !backgroundColor || backgroundColor.toLowerCase() === 'red' ? styles.red : styles.white;

  return (
    <button className={style} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
