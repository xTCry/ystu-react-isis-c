import React from 'react';

import { XAxis, YAxis, HorizontalGridLines, XYPlot, LineSeries, Highlight, VerticalGridLines, AreaSeries, LineMarkSeries } from 'react-vis';
import 'react-vis/dist/style.css';

import * as formulasUtil from '../../utils/formulas.util';

export const Variant5 = (props: { data: { x: number; y: number }[] }) => {
    const [lastDrawLocation, setLastDrawLocation] = React.useState(null);

    const csvData = props.data;

    const yArr = csvData.map((e) => e.y);
    const yArr20 = csvData.map((e) => e.y).slice(0, 20);

    const [std] = React.useState(formulasUtil.stdCalc(yArr));
    const [std20] = React.useState(formulasUtil.stdCalc(yArr20));

    const [roman] = React.useState(formulasUtil.Roman(yArr20, std20));
    const [sigma] = React.useState(formulasUtil.Sigma(yArr, std));

    
    return (
        <div>
            <h1>react-vis & zoom</h1>
            <div>
                <XYPlot
                    animation
                    xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]}
                    yDomain={lastDrawLocation && [lastDrawLocation.bottom, lastDrawLocation.top]}
                    width={800}
                    height={300}
                >
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis />

                    <AreaSeries
                        className="area-elevated-series-1"
                        color="#79c7e3"
                        data={sigma.map((e, i) => ({
                            x: csvData[i].x,
                            y: e.y + e.beta,
                            y0: e.y - e.beta,
                        }))}
                    />

                    <AreaSeries
                        className="area-elevated-series-2"
                        color="#19c0e8"
                        data={roman.map((e, i) => ({
                            x: csvData[i].x,
                            y: e.y + e.beta,
                            y0: e.y - e.beta,
                        }))}
                    />

                    <LineSeries data={csvData} color="#12939a" />

                    <Highlight
                        onBrushEnd={(area) => setLastDrawLocation(area)}
                        onDrag={(area) => {
                            setLastDrawLocation({
                                bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                                left: lastDrawLocation.left - (area.right - area.left),
                                right: lastDrawLocation.right - (area.right - area.left),
                                top: lastDrawLocation.top + (area.top - area.bottom),
                            });
                        }}
                    />
                </XYPlot>
            </div>

            <button className="showcase-button" onClick={() => setLastDrawLocation(null)}>
                Reset Zoom
            </button>

            <div>
                <h4>
                    <b>Last Draw Area</b>
                </h4>
                {lastDrawLocation ? (
                    <ul style={{ listStyle: 'none' }}>
                        <li>
                            <b>Top:</b> {lastDrawLocation.top}
                        </li>
                        <li>
                            <b>Right:</b> {lastDrawLocation.right}
                        </li>
                        <li>
                            <b>Bottom:</b> {lastDrawLocation.bottom}
                        </li>
                        <li>
                            <b>Left:</b> {lastDrawLocation.left}
                        </li>
                    </ul>
                ) : (
                    <span>N/A</span>
                )}
            </div>
        </div>
    );

}
