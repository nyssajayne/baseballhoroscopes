import * as d3 from 'd3';
import { useEffect, useState } from 'react';

// const chartWidth = 500;
// const chartHeight = 500;

// const [minOps, maxOps] = d3.extent(ops, o => o.value);
// const radiusScale = d3.scaleLinear().range([0, chartWidth / 2]);
// radiusScale.domain([0, maxOps])
// const perSliceAngle = (2 * Math.PI) / 12;

// const arc = d3.arc();
// const arc1 = arc({
//   innerRadius: radiusScale(minOps),
//   outerRadius: radiusScale(maxOps),
//   startAngle: 1 * perSliceAngle,
//   endAngle: (1 + 1) * perSliceAngle
// });

// console.log(minOps, maxOps);
// console.log(arc1);

// const Chart = (props) => {
//   const { width, height } = props;
//   const viewbox = `0 0 ${width} ${height}`;
//   return (
//     <svg viewbox={viewbox} width={width} height={height}>
//     <g>
//       <circle 
//         cx="250" 
//         cy="250" 
//         r="248" 
//         fill="transparent" 
//         stroke="navy" 
//         stroke-width="4px"></circle>
//         <path d={arc1} fill="pink" />
//       </g>
//     </svg>
//   )
// }

interface BaseballHoroscopes {
    OPS: {
        position: string,
        value: number
    }[]
}

const RadarChart = () => {
    const chartSize = 500;
    const [data, setData] = useState<BaseballHoroscopes | null>(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/baty")
        .then((response) => response.json())
        .then((data) => {
            setData(data.players[0].hitting.sun);

            // 
            // 
        })
    }, []);

    if(!data) return null;

    const { OPS }:BaseballHoroscopes = data;

    const starSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                       "Libra", "Scorpio", "Sagittarius", "Capricorn", 
                       "Aquarius", "Pisces"];
    const angleScale = d3.scaleOrdinal<number>()
    .domain(starSigns)
    .range(d3.range(-75, 285, 30));

    const [minOps, maxOps] = d3.extent(OPS, o => o.value) as [number, number];
    const radiusScale = d3.scaleLinear()
    .domain([0, maxOps])
    .range([0, chartSize / 2]);

    return (
        <svg viewBox={`0 0 ${chartSize} ${chartSize}`} width={chartSize} height={chartSize}>
            <g transform={`translate(${chartSize / 2}, ${chartSize / 2})`}>
                <circle r={chartSize * .5} fill="none" stroke="#fff" />
                <circle r={(chartSize * .5) * .25} fill="none" stroke="#fff" />
                <circle r={(chartSize * .5) * .50} fill="none" stroke="#fff" />
                <circle r={(chartSize * .5) * .75} fill="none" stroke="#fff" />
                {/*<circle r={chartSize / 6} fill="none" stroke="#fff" />*/}
                <g className="axes">
                    {d3.range(0, 360, 30).map((angle: number) => {
                        return (
                            <line
                                key={angle}
                                x1={0}
                                y1={0}
                                x2={(chartSize / 2) * Math.cos((angle * Math.PI) / 180)}
                                y2={(chartSize / 2) * Math.sin((angle * Math.PI) / 180)}
                                stroke="#fff"
                            />
                        )
                    })}
                </g>
                <g className="points">
                    {OPS.map((op) => {
                        console.log(op)
                        const angle = angleScale(op.position); // Get angle for the position
                        const radius = radiusScale(op.value); // Scale the OPS value
                        const x = radius * Math.cos((angle * Math.PI) / 180);
                        const y = radius * Math.sin((angle * Math.PI) / 180);

                        return (
                            <circle
                                key={op.position}
                                cx={x}
                                cy={y}
                                r={5}
                                fill="pink"
                                stroke="pink"
                                class={op.position}
                            />
                        );
                    })}
                </g>
            </g>
        </svg>
    )
}

export default RadarChart;