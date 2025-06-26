import './App.css';
import { useEffect, useState } from 'react';
import RadarChart from './components/RadarChart/RadarChart';
import Stars from './components/Stars/Stars';
import type { APIObject } from './globals/global.types';

const chartSize = 500;
const radius = chartSize * .5;

function App() {
  const [data, setData] = useState<APIObject | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/mcneil")
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        setData(data);
    })
  }, []);

  if(!data) return null;

  const { stats } = data.players[0];

  return (
    <RadarChart size={chartSize}>
      <>
        <Stars stats={stats[0].value.sun["OPS"]} radius={radius} color="pink" />
        <Stars stats={stats[0].value.sun["Slugging"]} radius={radius} color="yellow" />
      </>
    </RadarChart>
  )
}

export default App;