import { useState } from 'react';
import RadarChart from './components/RadarChart/RadarChart';
import Headline from './components/Headline/Headline';
import SearchPlayer from './components/SearchPlayer/SearchPlayer';
import TextButton from './components/TextButton/TextButton';
import type { APIObject, Player, Stats, HouseValue } from './globals/global.types';
import styles from './App.module.css';

const chartSize = 300;

const fetchPlayer = (player: string): Promise<APIObject | null> => {
  return fetch(`http://localhost:5000/${player}`)
  .then((response) => response.json())
}

const getStatistic = (stats: Stats): {[index: string]: HouseValue[]} => {
  const values = Object.values(stats);

  return values.reduce((acc, curr) => {
    return {...curr.sun, ...acc}
  }, {})
}

function App() {
  const [players, setPlayers] = useState<{player1: Player | null, player2: Player | null}>({
    player1: null,
    player2: null
  })
  const [choosePlayer, setChoosePlayer] = useState<Player[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<string[]>([])
  const [activeStat, setActiveStat] = useState<number>(0);

  const resetPlayers = (resetPlayer1: boolean, resetPlayer2: boolean) => {
    setPlayers((prevState) => ({
      ...prevState,
      player1: resetPlayer1 ? null : prevState.player1,
      player2: resetPlayer2 ? null : prevState.player2
    }))
  }

  const handleSubmit = (formData: FormData) => {
    const playerError = (player: string, message: string) => {
      throw new Error(`Error fetching data for ${player}: ${message}`);
    }

    setError(null);

    const player = formData.get("searchPlayer1") as string; 

    if(!player) playerError(player, "No player provided.");

    fetchPlayer(player)
    .then((response) => {
      if (!response || response.players.length === 0) {
        throw new Error("No player data found.");
      }

      console.log("Fetched player data:", response);

      resetPlayers(true, true);

      const { players } = response;

      if(players.length > 1) {
        setChoosePlayer(players);
      }
      else {
        const fetchedStats = Object.keys(getStatistic(players[0].stats));
        setStats(fetchedStats);          

        setPlayers((prevState) => ({
          ...prevState, player1: players[0]
        }));
      }
    })
    .catch((e: Error) => setError(e.message));
  };

  const handleReset = () => {
    resetPlayers(true, true);
    setError(null);
  }

  const handlePlayerClick = (player: Player) => {
    setPlayers((prevState) => ({
          ...prevState, player1: player
        }));
    setChoosePlayer(null);
  }

  const handleUpdateStatClick = (direction: "left" | "right") => {
    if(direction === "left") {
      setActiveStat((prev) => (prev > 0 ? prev - 1 : stats.length - 1));
    }
    else if(direction === "right") {
      setActiveStat((prev) => (prev < stats.length - 1 ? prev + 1 : 0));
    }
  }

  return (
    <div className={`${styles.wrapper} ${players.player1 && styles.data}`}>
      <Headline text="Baseball Horoscopes" large={players.player1 ? true : false} />
      {(players.player1) &&
        <>
          <RadarChart 
            size={chartSize} 
            player1={getStatistic(players.player1.stats)[stats[activeStat]]} 
            player2={players.player2 && getStatistic(players.player2.stats)[stats[activeStat]]} />
          <h2>{players.player1.player_name} - { stats[activeStat] }</h2>
          <TextButton onClick={() => handleUpdateStatClick("left")}>previous</TextButton>
          <TextButton onClick={() => handleUpdateStatClick("right")}>next</TextButton>
        </>
      }
      <SearchPlayer action={handleSubmit} inputName="searchPlayer1" handleReset={handleReset} />
      {choosePlayer &&
        <>
        <p>Did you mean...</p>
        <p>{choosePlayer.map((player) => {
            const { player_name } = player;
              return <TextButton onClick={() => handlePlayerClick(player)}>{player_name}</TextButton>
            })
       } </p>
       </>
      }
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}

export default App;