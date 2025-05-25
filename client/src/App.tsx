import { useState } from 'react'
import './App.css'

interface PositionInterface {
  "moon": string;
  "sun": string
}

interface PlayerInterface {
  [index: string]: {
    "birthday_position": PositionInterface,
  }
}

interface HoroscopeInterface {
  current_position: PositionInterface;
  [index: string]: PlayerInterface | PositionInterface;
}

function App() {
  const [moon, setMoon] = useState('');
  const [sun, setSun] = useState('');
  const [query, setQuery] = useState<string>('');

  const fetchAGuy = (search: string) => {
    return fetch(`http://localhost:5000/${search}`)
    .then((response) => response.json())
    .then((json: [HoroscopeInterface]) => {
      const { moon, sun } = json[0].current_position

      setMoon(moon);
      setSun(sun);
    })
  }

  const cleanInput = (input: string): string => {
    const trimmed = input.trim();
    const escaped = trimmed.replace(/[^a-zA-Z0-9 ]/g, '');

    return escaped;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanInput(event.target.value);
    setQuery(cleaned);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchAGuy(query);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>

      <p>Current Sun Position: {sun}</p> 
      <p>Current Moon Position: {moon}</p>
    </>
  )
}

export default App;