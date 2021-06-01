import React from 'react';

import { XAxis, YAxis, HorizontalGridLines, XYPlot, LineSeries, Highlight } from 'react-vis';
import 'react-vis/dist/style.css';

export class Variant5 extends React.Component<{ data: any[] }> {
    state = {
        lastDrawLocation: null,
    };

    render() {
        const { lastDrawLocation } = this.state;
        return (
            <div>
                <div>
                    <XYPlot
                        animation
                        xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]}
                        yDomain={lastDrawLocation && [lastDrawLocation.bottom, lastDrawLocation.top]}
                        width={500}
                        height={300}
                    >
                        <HorizontalGridLines />

                        <YAxis />
                        <XAxis />

                        <LineSeries data={this.props.data} />

                        <Highlight
                            onBrushEnd={(area) => this.setState({ lastDrawLocation: area })}
                            onDrag={(area) => {
                                this.setState({
                                    lastDrawLocation: {
                                        bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                                        left: lastDrawLocation.left - (area.right - area.left),
                                        right: lastDrawLocation.right - (area.right - area.left),
                                        top: lastDrawLocation.top + (area.top - area.bottom),
                                    },
                                });
                            }}
                        />
                    </XYPlot>
                </div>

                <button className="showcase-button" onClick={() => this.setState({ lastDrawLocation: null })}>
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
}
