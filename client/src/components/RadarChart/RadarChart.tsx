import type { JSX } from "react";
import * as d3 from 'd3';

const RadarChart = (props: {size: number, children: JSX.Element }) => {
    const { children, size } = props;
    const radius = size * .5;

    return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <g transform={`translate(${radius}, ${radius})`}>
                {[1, .25, .5, .75].map(c => 
                    <circle r={radius * c} fill="none" stroke="#fff" />
                )}
                <g className="axes">
                    {d3.range(0, 360, 30).map((angle: number) => {
                        return (
                            <line
                                key={angle}
                                x1={0}
                                y1={0}
                                x2={(size / 2) * Math.cos((angle * Math.PI) / 180)}
                                y2={(size / 2) * Math.sin((angle * Math.PI) / 180)}
                                stroke="#fff"
                            />
                        )
                    })}
                </g>
                <g className="stars">
                     {children}
                 </g>
            </g>
        </svg>
    )
}

export default RadarChart;