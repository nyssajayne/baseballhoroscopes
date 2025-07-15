import { useState } from "react";
import styles from './SearchPlayer.module.css';

const SearchPlayer = (props: {
    inputName: string,
    action: (formData: FormData) => void,
    handleReset: () => void }) => {
    const { inputName, action, handleReset } = props;

    const [query, setQuery] = useState<string>("");

    const cleanInput = (input: string): string => {
        return input.replace(/[^a-zA-Z0-9\s]/g, '');
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = cleanInput(event.target.value);
        setQuery(cleaned);
      };

    return (
        <form action={action} onReset={handleReset} className={styles.form}>
            <input
                type="text"
                name={inputName}
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
                className={styles.input}
            />

            <button type="submit" className={styles.button}>Search</button>
            <button type="reset" className={styles.button}>Clear</button>
        </form>
    )
};

export default SearchPlayer;