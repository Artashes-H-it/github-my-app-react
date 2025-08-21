import styles from './Button.module.scss'

const Button = ({ onClick = null, type, children}) => {
    return (
       <button onClick={onClick} type={type} className={styles.button}>
        {children}
       </button>
    ) ;
}

export default Button;