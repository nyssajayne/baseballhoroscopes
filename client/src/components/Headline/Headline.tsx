import styles from './Headline.module.css';

const Headline = (props: { text: string, large: boolean }) => {
    const { text, large } = props;

    return <h1 className={`${styles.headline} ${large && styles.shrunk}`}>{text}</h1>
}

export default Headline;