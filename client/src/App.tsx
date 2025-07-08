import { useState } from 'react';
import RadarChart from './components/RadarChart/RadarChart';
import Stars from './components/Stars/Stars';
import Headline from './components/Headline/Headline';
import SearchPlayer from './components/SearchPlayer/SearchPlayer';
import type { APIObject } from './globals/global.types';
import styles from './App.module.css';

const chartSize = 500;
const radius = chartSize * .5;

function App() {
  const [data, setData] = useState<APIObject | null>(null);

  console.log(data);

  return (
    <div className={`${styles.wrapper} ${data && styles.data}`}>
      <Headline text="Baseball Horoscopes" large={data ? true : false} />
      <SearchPlayer data={data} setData={setData} />
      {data &&
        <RadarChart size={chartSize}>
           <>
             <Stars stats={data.players[0].stats[0].value.sun["OPS"]} radius={radius} color="pink" />
             <Stars stats={data.players[0].stats[0].value.sun["Slugging"]} radius={radius} color="yellow" />
           </>
        </RadarChart>}
      {/*<p>{data && JSON.stringify(data)}</p>*/}
    </div>
  )
}

export default App;