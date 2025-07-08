import { useState } from "react";
import type { APIObject } from '../../globals/global.types';
import styles from './SearchPlayer.module.css';

const SearchPlayer = (props: {
    data: APIObject | null, 
    setData: React.Dispatch<React.SetStateAction<APIObject | null>>}) => {
    const { setData } = props;

    const [query, setQuery] = useState<string>("");

    const cleanInput = (input: string): string => {
        return input.replace(/[^a-zA-Z0-9\s]/g, '');
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const cleaned = cleanInput(event.target.value);
        setQuery(cleaned);
      };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch(`http://localhost:5000/${query}`)
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((e) => console.error(e))
      };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
                className={styles.input}
            />

            <button type="submit" className={styles.button}>Search</button>
        </form>
    )
};

export default SearchPlayer;