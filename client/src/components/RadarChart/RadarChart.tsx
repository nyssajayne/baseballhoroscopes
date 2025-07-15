import * as d3 from 'd3';

// import labels from './Labels/Labels';
import Stars from "../Stars/Stars";
import type { HouseValue } from "../../globals/global.types";

const RadarChart = (props: {
    size: number, 
    player1: HouseValue[] | null,
    player2: HouseValue[] | null }) => {
    const { size, player1, player2 } = props;
    const radius = size * .5;

    return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <g transform={`translate(${radius}, ${radius})`}>
                {[1, .25, .5, .75].map(c => 
                    <circle r={radius * c} fill="none" stroke="#fff" />
                )}
                <g className="axes">
                    {d3.range(0, 360, 30).map((angle: number, i: number) => {
                        return (
                            <g>
                                <line
                                    key={angle}
                                    x1={0}
                                    y1={0}
                                    x2={(size / 2) * Math.cos((angle * Math.PI) / 180)}
                                    y2={(size / 2) * Math.sin((angle * Math.PI) / 180)}
                                    stroke="#fff"
                                />
                                {/*{labels[i]}*/}
                            </g>
                        )
                    })}
                </g>
                <g className="stars">
                    {player1 && <Stars stats={player1} radius={radius} color="yellow" />}
                    {player2 && <Stars stats={player2} radius={radius} color="pink" />}
                 </g>
            </g>
        </svg>
    )
}

export default RadarChart;