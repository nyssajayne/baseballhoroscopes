import styles from './Headline.module.css';

const Headline = (props: { text: string }) => {
    const { text } = props;

    return <h1 className={styles.headline}>{text}</h1>
}

export default Headline;