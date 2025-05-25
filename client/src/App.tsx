import { useState } from 'react'
import './App.css'

interface PositionInterface {
  "moon": string;
  "sun": string;
}

interface PlayerInterface {
  "player_name": string;
  "birthday_position": PositionInterface;
  "debut_position": PositionInterface;
}

interface HoroscopeInterface {
  current_position: PositionInterface;
  players: PlayerInterface[]
}

function App() {
  const [moon, setMoon] = useState('');
  const [sun, setSun] = useState('');
  const [player, setPlayer] = useState('');
  const [query, setQuery] = useState<string>('');

  const fetchAGuy = (search: string) => {
    return fetch(`http://localhost:5000/${search}`)
    .then((response) => response.json())
    .then((json: HoroscopeInterface) => {
      const { moon, sun } = json.current_position
      const { player_name } = json.players[0]

      setMoon(moon);
      setSun(sun);
      setPlayer(player_name);
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

      <p>Player Name: {player}</p>
      <p>Current Sun Position: {sun}</p> 
      <p>Current Moon Position: {moon}</p>
    </>
  )
}

export default App;