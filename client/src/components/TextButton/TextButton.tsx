import styles from './TextButton.module.css'

const TextButton = (props: { children: string, onClick?: () => void }) => {
    const { children, onClick } = props;

    return <button className={styles.button} onClick={onClick}>{children}</button>
}

export default TextButton;