import * as d3 from 'd3';
import type { HouseValue } from '../../globals/global.types';

const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", 
    "Aquarius", "Pisces"];

const Stars = (props: { stats: HouseValue[], radius: number, color: string }) => {
    const { stats, radius, color } = props;

    const [_, max] = d3.extent(Object.values(stats), s => s.value) as [number, number];
    const radiusScale = d3.scaleLinear()
    .domain([0, max])
    .range([0, radius]);

    const angleScale = d3.scaleOrdinal<number>()
    .domain(zodiacSigns)
    //rotated back to put Aries at 1:30
    .range(d3.range(-75, 285, 30));

    return (
        <g className="points">
        {stats.map((s) => {
            const { position, value } = s;
            const angle = angleScale(position);
            const Rradius = radiusScale(value);
            const x = Rradius * Math.cos((angle * Math.PI) / 180);
            const y = Rradius * Math.sin((angle * Math.PI) / 180);

            return <circle
                key={`${position}-${value}`}
                cx={x}
                cy={y}
                r={5}
                fill={color}
                stroke={color}
            />
        })}
        </g>
    )
}

export default Stars;